import { InputNumber, Input } from "antd";
import React, { useRef } from "react";
import { useState } from "react";
import { formatCurrencyIfCurrency } from "../../../utils/common";

const AutoResizeInput = ({
  type,
  defaultValue,
  tabsHasErrors,
  placeholder,
  handleRequestRows,
  record,
  _key,
  splittedText,
}) => {
  const [width, setWidth] = useState(
    type === "number"
      ? 70
      : placeholder && placeholder.length > 20
      ? placeholder.length * 10
      : 200
  );
  const [state, seState] = useState(defaultValue);
  // Ref to store pev value of input
  const value = useRef();

  if (type === "number") {
    return (
      <InputNumber
        defaultValue={defaultValue}
        value={state}
        style={
          tabsHasErrors.includes("Recommended Strategies") && !state
            ? { border: "2px solid red", width }
            : { width }
        }
        placeholder={placeholder}
        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        parser={value => value.replace(/\$\s?|(,*)/g, "")}
        onChange={event => {
          seState(event);
          // Change size of input after 4 characters are entered
          if (String(event).length > 4) {
            // Compare length of curent event value with prev value and increment or decrement accordingly
            if (String(event).length > String(value.current).length) {
              // 10: Average number width, accomodates the commas added.
              setWidth(prev => prev + 10);
            } else if (String(event).length < String(value.current).length) {
              setWidth(prev => prev - 10);
            }
          } else {
            // Reset to orignal width
            setWidth(70);
          }
          value.current = event;

          handleRequestRows({
            record: record.dropdownKey,
            field: { key: _key, value: event },
            id: record.id,
          });
        }}
      />
    );
  }
  if (type === "text") {
    return (
      <Input.TextArea
        autoSize
        defaultValue={defaultValue}
        value={state}
        style={
          tabsHasErrors.includes("Recommended Strategies") && !state
            ? { border: "2px solid red", width }
            : { width }
        }
        placeholder={placeholder}
        onChange={event => {
          seState(event.target.value);
          let lengthLimit =
            placeholder && placeholder.length > 20 ? placeholder.length : 20;
          if (String(event.target.value).length > lengthLimit) {
            if (
              String(event.target.value).length > String(value.current).length
            ) {
              // 9: Average character width
              setWidth(prev => prev + 9);
            } else if (
              String(event.target.value).length < String(value.current).length
            ) {
              setWidth(prev => prev - 9);
            }
          } else {
            setWidth(
              placeholder && placeholder.length > 20
                ? placeholder.length * 10
                : 200
            );
          }
          value.current = event.target.value;

          handleRequestRows({
            record: record.dropdownKey,
            field: { key: _key, value: event.target.value },
            id: record.id,
          });
        }}
        onBlur={() => {
          let currency = formatCurrencyIfCurrency(state);
          if (state !== currency) {
            handleRequestRows({
              record: record.dropdownKey,
              field: { key: _key, value: currency },
              id: record.id,
            });
            seState(currency);
          }
        }}
      />
    );
  }
};

export default AutoResizeInput;
