import React, { useState } from "react";
import { Select } from "antd";
const { Option } = Select;

const defaultNewOption = { key: "", value: "" };

function CustomSelect({
  getValueForComponent,
  platform,
  setTableValue,
  validateFields,
  platformsWithErrors,
  inputType2Options = [],
  setInputType2Options,
}) {
  const [newOption, setNewOption] = useState(defaultNewOption);
  const [selectedValue, setSelectedValue] = useState("");

  function onChange(value) {
    if (value.startsWith("_")) {
      let _value = value.slice(1);
      setInputType2Options(prev => [{ key: value, value: _value }, ...prev]);
      setTableValue(platform, "targetProduct", `custom:${_value}`);
      setSelectedValue(_value);
    } else {
      setTableValue(platform, "targetProduct", `id:${value}`);
      setSelectedValue(value);
    }

    setNewOption(defaultNewOption);
  }

  function onFocus() {
    console.log("focus");
  }

  function isExist(search) {
    let exist = false;
    // const found = inputType2Options.some(
    //   (el) => el.value.toLowerCase().indexOf(search.toLowerCase()) >= 0
    // );

    const found = inputType2Options.some(
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
      value={getValueForComponent(platform, "targetProduct")}
      dropdownClassName="custom-invselect-dropdown"
      style={
        platformsWithErrors.includes(platform) &&
        !getValueForComponent(platform, "targetProduct")
          ? { border: "2px solid red", width: "100%" }
          : { width: "100%" }
      }
      placeholder="Select a person"
      optionFilterProp="children"
      onChange={onChange}
      onFocus={onFocus}
      onBlur={validateFields(platform, "targetProduct")}
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

      {inputType2Options.map((item, index) => (
        <Option key={item.key} value={item.key}>
          {item.value}
        </Option>
      ))}
    </Select>
  );
}

export default CustomSelect;

// import React, { useState } from "react";
// import { Select, Divider, Input } from "antd";
// import { PlusOutlined } from "@ant-design/icons";

// const { Option } = Select;

// const CustomSelectInput = ({
//   getValueForComponent,
//   platform,
//   setTableValue,
//   validateFields,
//   platformsWithErrors,
//   inputType2Options,
//   setInputType2Options,
// }) => {
//   const [textValue, setTextValue] = useState("");

//   const onAddNewOption = () => {
//     const newOption = {
//       key: `${textValue}`,
//       value: textValue,
//     };
//     setInputType2Options((prev) => [newOption, ...prev]);
//     setTableValue(platform, "targetProduct", `custom:${textValue}`);
//   };

//   return (
//     <>
//       <Select
//         showSearch
//         value={getValueForComponent(platform, "targetProduct")}
//         onChange={(value) => {
//           setTableValue(platform, "targetProduct", `id:${value}`);
//         }}
//         onBlur={validateFields(platform, "targetProduct")}
//         style={
//           platformsWithErrors.includes(platform) && !getValueForComponent(platform, "targetProduct")
//             ? { border: "2px solid red", width: "100%" }
//             : { width: "100%" }
//         }
//         filterOption={(input, option) => (option.label || "").toLowerCase().includes(input.toLowerCase())}
//         dropdownRender={(menu) => (
//           <>
//             {menu}
//             <Divider style={{ margin: "4px 0" }} />
//             <div style={{ display: "flex", flexWrap: "nowrap", padding: 8 }}>
//               <Input
//                 style={{ flex: "auto" }}
//                 value={textValue}
//                 onChange={(event) => {
//                   const { value } = event.target;
//                   setTextValue(value);
//                 }}
//               />
//               <a
//                 href="!#"
//                 style={{ flex: "none", padding: "8px", display: "block", cursor: "pointer" }}
//                 onClick={(event) => {
//                   event.preventDefault();
//                   onAddNewOption();
//                 }}>
//                 <PlusOutlined />
//               </a>
//             </div>
//           </>
//         )}>
//         {inputType2Options &&
//           inputType2Options.map((item) => (
//             <Option key={item.key} value={item.key} label={item.value}>
//               {item.value}
//             </Option>
//           ))}
//       </Select>
//     </>
//   );
// };

// export default CustomSelectInput;
