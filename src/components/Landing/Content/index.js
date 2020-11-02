import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import { Input, Radio, Table } from "antd";
import ActionButton from "./components/ActionButton";
import StatusWithComments from "./components/StatusWithComments";
import "./index.css";

const columns = [
  {
    title: "Client Name",
    dataIndex: "name",
    key: "name",
    fixed: "left",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Appointment Date",
    dataIndex: "appointmentDate",
    key: "appointmentDate",
    sorter: (a, b) => {
      const dateA = moment(a.appointmentDate, "MM/DD/YYYY");
      const dateB = moment(b.appointmentDate, "MM/DD/YYYY");
      return dateA.isBefore(dateB) ? -1 : 1;
    },
  },
  {
    title: "Submit date",
    dataIndex: "submissionDate",
    key: "submissionDate",
    sorter: (a, b) => {
      const dateA = moment(a.submissionDate, "MM/DD/YYYY");
      const dateB = moment(b.submissionDate, "MM/DD/YYYY");
      return dateA.isBefore(dateB) ? -1 : 1;
    },
  },
  {
    title: "Est. completion",
    dataIndex: "completionDate",
    key: "completionDate",
    sorter: (a, b) => {
      const dateA = moment(a.completionDate, "MM/DD/YYYY");
      const dateB = moment(b.completionDate, "MM/DD/YYYY");
      return dateA.isBefore(dateB) ? -1 : 1;
    },
  },
  {
    title: "Est. cost",
    dataIndex: "cost",
    key: "cost",
    sorter: (a, b) => {
      const costA = Number(a.cost.slice(1));
      const costB = Number(b.cost.slice(1));
      return costA - costB;
    },
  },
  {
    title: "Status",
    key: "status",
    render: (text, record) => {
      return (
        <StatusWithComments
          status={record.status}
          numUnreadMessages={record.numUnreadMessages}
        />
      );
    },
  },
  {
    title: "Action",
    key: "action",
    fixed: "right",
    render: (text, record) => {
      console.log(record);
      return <ActionButton status={record.status} soaId={record.soa_id} />;
    },
  },
];

const LandingContent = React.memo(({ data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    console.log(data, filter);
    if (filter !== "all") {
      setFilteredData(data.filter(row => row.status === filter));
    } else {
      setFilteredData(data);
    }
  }, [filter, data]);

  useEffect(() => {
    if (query !== "") {
      setFilteredData(prev =>
        prev.filter(row =>
          row.name.toLowerCase().includes(query.toLocaleLowerCase())
        )
      );
    } else if (filter !== "all") {
      setFilteredData(data.filter(row => row.status === filter));
    } else {
      setFilteredData(data);
    }
  }, [query]);

  return (
    <div style={{ backgroundColor: "#fff", padding: "20px 16px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="mb-8"
      >
        <Radio.Group value={filter} onChange={e => setFilter(e.target.value)}>
          <Radio.Button className="mr-8 mb-8" value="all">
            All
          </Radio.Button>
          <Radio.Button className="mr-8 mb-8" value="submitted">
            Submitted
          </Radio.Button>
          <Radio.Button className="mr-8 mb-8" value="inProgress">
            In-Progress
          </Radio.Button>
          <Radio.Button className="mr-8 mb-8" value="approved">
            Approved
          </Radio.Button>
          <Radio.Button className="mr-8 mb-8" value="readyToPresent">
            Ready to Present
          </Radio.Button>
        </Radio.Group>
        <Input.Search
          placeholder="Search here"
          allowClear
          onSearch={value => {
            setQuery(value);
          }}
          onChange={e => {
            setQuery(e.target.value);
          }}
          style={{ width: 200, margin: "0 10px" }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: true }}
        pagination
      />
    </div>
  );
});

export default LandingContent;
