import React, { useState } from "react";
import { Select } from "antd";
const { Option } = Select;

const defaultNewOption = { key: "", value: "" };

function CustomSelect({
  defaultValue = "",
  options = [],
  hasError = false,
  onDropDownValueChangeCallback = undefined,
  onBlur,
  full,
}) {
  const defaultDropdownValue = defaultValue.startsWith("id:")
    ? defaultValue.slice(3)
    : defaultValue.startsWith("custom:")
    ? `${defaultValue.slice(7)}`
    : "";
  const [selectValue, setSelectValue] = useState(defaultDropdownValue);
  const [state, setState] = useState(options);
  const [newOption, setNewOption] = useState(defaultNewOption);
  const [selectedValue, setSelectedValue] = useState("");

  function onChange(value) {
    if (value.startsWith("_")) {
      let _value = value.slice(1);
      if (_value.trim() !== "") {
        onDropDownValueChangeCallback(`custom:${_value}`, _value);
        setState(prev => [{ key: value, value: _value }, ...prev]);
        setSelectedValue(_value);
      }
    } else {
      onDropDownValueChangeCallback(
        `id:${value}`,
        state.find(item => item.key === value).value
      );
      setSelectedValue(value);
    }

    setSelectValue(value);
    setNewOption(defaultNewOption);
  }

  function onFocus() {
    console.log("focus");
  }

  function isExist(search) {
    let exist = false;
    // const found = state.some(
    //   (el) => el.value.toLowerCase().indexOf(search.toLowerCase()) >= 0
    // );

    const found = state.some(
      el => el.value.toLowerCase() === search.toLowerCase()
    );

    if (found) exist = true;

    return exist;
  }

  function onSearch(val) {
    let option = isExist(val);
    if (!option && val.trim() !== "") {
      setNewOption({ key: `_${val}`, value: val });
    }

    if (val === "") {
      setNewOption(defaultNewOption);
    }
  }

  return (
    <Select
      showSearch
      defaultValue={selectValue}
      value={selectValue}
      dropdownClassName="custom-invselect-dropdown"
      style={
        hasError && !selectValue
          ? { border: "2px solid red", minWidth: 300, width: 300 }
          : { minWidth: 300, width: 300 }
      }
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onSearch={onSearch}
      filterOption={(input, option) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {newOption.key !== "" && (
        <Option key={newOption.key} value={newOption.key}>
          {selectedValue === newOption.value
            ? newOption.value
            : `Add "${newOption.value}"`}
        </Option>
      )}

      {state.map((item, index) => (
        <Option key={item.key} value={item.key}>
          {item.value}
        </Option>
      ))}
    </Select>
  );
}

export default CustomSelect;

// import React, { useEffect, useState,useRef } from "react";
// import { Divider, Input, Select } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const Option = Select.Option;

// const CustomSelectComponent = ({
//   defaultValue = "",
//   options = [],
//   hasError = false,
//   onAddNewOptionCallback = undefined,
//   onDropDownValueChangeCallback = undefined,
//   onBlur,
//   full,
// }) => {
//   const defaultDropdownValue = defaultValue.startsWith("id:")
//     ? defaultValue.slice(3)
//     : defaultValue.startsWith("custom:")
//     ? `_${defaultValue.slice(7)}`
//     : "";
//   const [selectOptions, setSelectOptions] = useState(options);
//   const [textValue, setTextValue] = useState("");
//   const [error, setError] = useState(false);
//   const [selectValue, setSelectValue] = useState(defaultDropdownValue);
//   const ref = useRef(null)

//   useEffect(() => {
//     if (defaultDropdownValue.length !== 0 && defaultDropdownValue.startsWith("_")) {
//       const index = options.find((op) => op.key === defaultDropdownValue);

//       if (index !== -1) {
//         const newOption = {
//           key: defaultDropdownValue,
//           value: defaultDropdownValue.slice,
//         };
//         setSelectOptions((options) => [newOption, ...options]);
//       }
//     }
//   }, [defaultDropdownValue, options]);

//   const onAddNewOption = () => {
//     if(textValue.trim()!=="") {
//       const newOption = {
//         key: `_${textValue}`,
//         value: textValue,
//       };
//       setSelectOptions((options) => [newOption, ...options]);
//       setSelectValue(`_${textValue}`);

//       if (onDropDownValueChangeCallback) {
//         const newValue = `custom:${textValue}`;
//         onDropDownValueChangeCallback(newValue, textValue);
//       }
//     } else {
//       setError(true)
//     }
//     // ref.current.blur()
//     console.log(ref.current);
//   };

//   const onDropDownValueChange = (value) => {
//     setSelectValue(value);

//     if (onDropDownValueChangeCallback) {
//       const newValue = value.startsWith("_") ? `custom:${value.slice(1)}` : `id:${value}`;
//       onDropDownValueChangeCallback(newValue, selectOptions.find((item) => item.key === value).value);
//     }
//   };

//   return (
//     <Select
//       ref={input => ref.current=input}
//       showSearch
//       onBlur={() => {
//         onBlur();
//       }}
//       dropdownClassName="custom-invselect-dropdown"
//       defaultValue={selectValue}
//       value={selectValue}
//       filterOption={(input, option) => (option.label || "").toLowerCase().includes(input.toLowerCase())}
//       style={
//         hasError && !selectValue
//           ? { border: "2px solid red", minWidth: 300, width: full && "100%" }
//           : { minWidth: 300, width: full && "100%" }
//       }
//       dropdownRender={(menu) => (
//         <div>
//           {menu}
//           <Divider style={{ margin: "4px 0" }} />
//           <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
//             <Input
//               style={error
//                 ? { border: "2px solid red", flex: "auto" }
//                 : { flex: "auto" }}
//               value={textValue}
//               placeholder="Enter Custom Text"
//               onChange={(event) => {
//                 const { value } = event.target;
//                 setTextValue(value);
//                 if(value.trim() !== ""){
//                   setError(false)
//                 }
//               }}
//             />
//             <a
//               href="!#"
//               style={{ flex: "none", padding: "8px", display: "block", cursor: "pointer" }}
//               onClick={(event) => {
//                 event.preventDefault();
//                 onAddNewOption();
//               }}>
//               <PlusOutlined />
//             </a>
//           </div>
//         </div>
//       )}
//       onChange={(value) => {
//         onDropDownValueChange(value);
//       }}>
//       {selectOptions.map((item) => (
//         <Option key={item.key} value={item.key} label={item.value}>
//           {item.value}
//         </Option>
//       ))}
//     </Select>
//   );
// };

// export default CustomSelectComponent;
