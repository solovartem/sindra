import React, { useContext, useState, useEffect, useRef } from "react";
import { Table, Input, Button, Form, Popconfirm } from "antd";
import { CloseSquareTwoTone, PlusOutlined } from "@ant-design/icons";
import { uniqueId } from "lodash";

import "./index.css";
const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  handleRemove,
  tabHasErrors,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async e => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        // rules={[
        //   {
        //     required:record.key===0,
        //     message: `this field is required.`,
        //   },
        // ]}
        // style={(!record[dataIndex] && record.key===0) && tabHasErrors ? {border: '2px solid red',width:'100%',margin:0} : {width:'100%', margin: 0}}
        style={{ width: "100%", margin: 0 }}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div style={{ display: "flex" }}>
        <div
          className="editable-cell-value-wrap"
          // style={{
          //   paddingRight: 24,
          // }}
          onClick={toggleEdit}
          // style={(!record[dataIndex] && record.key===0) && tabHasErrors ? {border: '2px solid red',width:'100%'} : {width:'100%'}}
          style={{ width: "100%", margin: 0 }}
        >
          {children}
        </div>
        {title === "To be funded from" && (
          <Popconfirm
            title="Are you sure you want to delete this fee?"
            key={uniqueId()}
            onConfirm={() => handleRemove(record)}
          >
            <CloseSquareTwoTone
              key={uniqueId()}
              style={{
                fontSize: 25,
                display: "flex",
                alignItems: "center",
                paddingLeft: "10px",
              }}
            />
          </Popconfirm>
        )}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = props.columns;
    this.state = {
      title: props.title,
      table: props.table,
      dataSource: props.data,
      count: 2,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.dataSource !== this.state.dataSource) {
      const rows = this.state.dataSource.map(({ key, ...row }) => row);
      this.props.handleTableChange({ table: this.state.table, rows });
    }
  }

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  };

  handleRemove = record => {
    const { dataSource } = this.state;
    const index = dataSource.findIndex(data => data.key === record.key);
    if (index !== -1) {
      const arr = [...dataSource];
      arr.splice(index, 1);
      this.setState({
        dataSource: arr,
        count: arr.length,
      });
    }
  };

  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    this.setState({
      dataSource: newData,
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          handleRemove: this.handleRemove,
          tabHasErrors: this.props.tabHasErrors,
        }),
      };
    });
    return (
      <div>
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={false}
        />
        <Button
          type="dashed"
          onClick={this.handleAdd}
          style={{ width: "100%", marginTop: "8px" }}
        >
          <span>
            <PlusOutlined /> Add new {this.state.title}
          </span>
        </Button>
      </div>
    );
  }
}

export default EditableTable;
