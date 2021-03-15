/*
Source: https://github.com/smashingmagazine/ionic-react-forms/blob/master/src/components/Input.tsx
**/

import React, { FC } from "react";
import { IonItem, IonLabel, IonInput, IonText } from "@ionic/react";
import { Controller, Control, NestDataObject, FieldError } from "react-hook-form";

export interface InputProps {
  name: string;
  control?: Control;
  label?: string;
  component?: JSX.Element;
  errors?: NestDataObject<Record<string, any>, FieldError>;
  autocapitalize?: string
}

const Input: FC<InputProps> = ({
  name,
  control,
  component,
  label,
  errors,
  autocapitalize
}) => {
  return (
    <>
      <IonItem>
        {label && <IonLabel position="floating">{label}</IonLabel>}
        <Controller
          as={
            component ?? (
              <IonInput
                aria-invalid={errors && errors[name] ? "true" : "false"}
                aria-describedby={`${name}Error`}
                autocapitalize={autocapitalize}
                required
              />
            )
          }
          name={name}
          control={control}
          onChangeName="onIonChange"
        />
      </IonItem>
      {errors && errors[name] && (
        <IonText color="danger" className="ion-padding-start">
          <small>
            <span role="alert" id={`${name}Error`}>
              {label === "Verify Password" ? errors[name].message : `${label} ${errors[name].message.slice(name.length)}`}
            </span>
          </small>
        </IonText>
      )}
    </>
  );
};

export default Input;
