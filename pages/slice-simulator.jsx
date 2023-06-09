
import { SliceZone } from "@prismicio/react";
import * as React from "react"
import { components as ecommerceComponents } from '../slices/ecommerce/index'
import { components as marketingComponents } from '../slices/marketing/index'
import { components as navigationComponents } from '../slices/navigation/index'

import {
	StateEventType,
	disableEventHandler,
	getDefaultMessage,
	getDefaultProps,
	getDefaultSlices,
	onClickHandler,
	simulatorClass,
	simulatorRootClass,
  SimulatorManager
} from "@prismicio/simulator/kit";






const __allComponents = {  ...ecommerceComponents, ...marketingComponents, ...navigationComponents }

const SliceSimulatorPage = () => {
  return (
    <SliceSimulator
      sliceZone={({ slices }) => (
        <SliceZone slices={slices} components={__allComponents} />
      )}
    />
  );
};

export default SliceSimulatorPage;






// Temp code from adaptor/next and moved to JS


const simulatorManager = new SimulatorManager();



const SliceSimulator = ({
	sliceZone: SliceZoneComp,
	background,
	zIndex,
	className,
}) => {
	const defaultProps = getDefaultProps();

	const [slices, setSlices] = React.useState(() => getDefaultSlices());
	const [message, setMessage] = React.useState(() => getDefaultMessage());

	React.useEffect(() => {

		simulatorManager.state.on(
			StateEventType.Slices,
			(_slices) => {
				setSlices(_slices);
			},
			"simulator-slices",
		);
		simulatorManager.state.on(
			StateEventType.Message,
			(_message) => {
				setMessage(_message);
			},
			"simulator-message",
		);

		simulatorManager.init();

		return () => {
			simulatorManager.state.off(
				StateEventType.Slices,
				"simulator-slices",
			);

			simulatorManager.state.off(
				StateEventType.Message,
				"simulator-message",
			);
		};
	}, []);

	return (
		<div
			className={[simulatorClass, className].filter(Boolean).join(" ")}
			style={{
				zIndex:
					typeof zIndex === "undefined"
						? defaultProps.zIndex
						: zIndex ?? undefined,
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100vh",
				overflow: "auto",
				background:
					typeof background === "undefined"
						? defaultProps.background
						: background ?? undefined,
			}}
		>
			{message ? (
				<article dangerouslySetInnerHTML={{ __html: message }} />
			) : slices.length ? (
				<div
					id="root"
					className={simulatorRootClass}
					onClickCapture={onClickHandler}
					onSubmitCapture={disableEventHandler}
				>
					<SliceZoneComp slices={slices} />
				</div>
			) : null}
		</div>
	);
};