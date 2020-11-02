import React from "react";
import moment from "moment";
import { Layout } from "antd";
import LandingInnerHeader from "../../components/Landing/InnerHeader";
import LandingContent from "../../components/Landing/Content";

const { Content } = Layout;

const mockAPI = {
  data: {
    kpis: {
      numUpcomingAppointments: 16,
      numUnreadComments: 5,
      numReadyToPresent: 3,
    },
    requests: [
      {
        client: {
          id: "07e37f99-0d35-482b-a9c6-33a457f20b76",
          firstName: "Jack",
          lastName: "Smith",
        },
        soa: {
          soa_id: "b1537f3f-407c-4085-9ec4-3f4e078c6f23",
          appointmentDate: "1604210536",
          submissionDate: "1604210536",
          completionDate: "1604210536",
          cost: "$399",
          status: "submitted",
          numUnreadMessages: 0,
        },
      },
      {
        client: {
          id: "887721ad-123e-41f4-9346-0bc3c477c743",
          firstName: "Jill",
          lastName: "Johnson",
        },
        soa: {
          soa_id: "80fd723f-447c-497e-8669-99d626b04e21",
          appointmentDate: "1604210536",
          submissionDate: "1604210536",
          completionDate: "1604210536",
          cost: "$199",
          status: "inProgress",
          numUnreadMessages: 2,
        },
      },
    ],
  },
};

const { data } = mockAPI;

const tableData = data.requests.map(request => {
  const { soa, client } = request;
  return {
    ...soa,
    appointmentDate: moment.unix(soa.completionDate).format("MMM DD, YYYY"),
    submissionDate: moment.unix(soa.submissionDate).format("MMM DD, YYYY"),
    completionDate: moment.unix(soa.completionDate).format("MMM DD, YYYY"),
    key: soa.soa_id,
    name: `${client.firstName} ${client.lastName}`,
  };
});

const NewRequest = () => {
  return (
    <>
      <LandingInnerHeader {...data.kpis} />
      <Content style={{ margin: "0 16px", minHeight: 360 }}>
        <LandingContent data={tableData} />
      </Content>
    </>
  );
};

export default NewRequest;
