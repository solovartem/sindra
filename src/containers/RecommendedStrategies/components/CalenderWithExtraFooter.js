import React from "react";
import { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import { useRef } from "react";

const idDateText = {
  now: "Now",
  retirement: "Retirement",
  agePension: "Age Pension age",
};

const ExtraFooters = ({ handleRequestRows }) => {
  return (
    <>
      <div className="extra-footers" onClick={() => handleRequestRows("now")}>
        Now
      </div>
      <div
        className="extra-footers"
        onClick={() => handleRequestRows("retirement")}
      >
        Retirement
      </div>
      <div
        className="extra-footers"
        onClick={() => handleRequestRows("agePension")}
      >
        Age Pension age
      </div>
    </>
  );
};

const CalenderWithExtraFooter = ({
  defaultValue,
  tabsHasErrors,
  monthFormat,
  handleRequestRows,
  record,
  _key,
  splittedText,
  idDate,
}) => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(idDate);
  const [value, setValue] = useState(defaultValue);
  const datePickerRef = useRef(null);

  const handleExtraRequestRows = value => {
    handleRequestRows({
      record: record.dropdownKey,
      field: { key: _key, value: `id:${value}` },
      id: record.id,
    });
    setText(value);
    setOpen(false);
    setValue(null);
    datePickerRef.current.blur();
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }}>
        <DatePicker
          ref={datePickerRef}
          allowClear={false}
          dropdownClassName="custom-picker"
          open={open}
          defaultValue={defaultValue ? moment(defaultValue, "MM/YYYY") : null}
          value={value}
          style={
            tabsHasErrors.includes("Recommended Strategies") && !defaultValue
              ? {
                  border: "2px solid red",
                  width: 200,
                }
              : { width: 200 }
          }
          placeholder={text.length === 0 ? "Select Month" : ""}
          format={monthFormat}
          picker="month"
          onChange={value => {
            if (value) {
              handleRequestRows({
                record: record.dropdownKey,
                field: { key: _key, value: `date:${value.format("MM/YYYY")}` },
                id: record.id,
              });
            }
            setText("");
            setOpen(false);
            setValue(value);
          }}
          onClick={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
          }}
          renderExtraFooter={() => (
            <ExtraFooters handleRequestRows={handleExtraRequestRows} />
          )}
        />
        {text.length !== 0 && !open && (
          <span
            style={{
              zIndex: 0,
              pointerEvents: "none",
              position: "absolute",
              left: "8px",
            }}
          >
            <b>{idDateText[text]}</b>
          </span>
        )}
      </div>
    </>
  );
};

export default CalenderWithExtraFooter;
