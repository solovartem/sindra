import React, { useRef } from "react";
import { useEffect } from "react";
import { Button, Layout } from "antd";
import NewRequestInnerHeader from "../../components/NewRequest/InnerHeader";
import NewRequestContent from "../../components/NewRequest/Content";
import { startForm } from "../../axios/login";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { LoadingWrapper, SubTextBlack } from "../../components/Loading/styled";

const { Content } = Layout;

const NewRequest = () => {
  const isError = useRef(false);
  const validateRef = useRef(false);

  const toggleError = data => {
    isError.current = data;
  };

  const setValidateRef = func => {
    validateRef.current = func;
  };

  const { soaId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const [soaError, setSoaError] = useState(false);

  const getSoaId = async () => {
    if (!soaId) {
      setLoading(true);
      setSoaError(false);
      startForm()
        .then(data => {
          // throw Error
          setLoading(false);
          setSoaError(false);
          history.push(`/soa/${data.soaId}`);
        })
        .catch(e => {
          setLoading(false);
          setSoaError(true);
        });
    } else {
      localStorage.setItem("soaId", soaId);
    }
  };

  useEffect(() => {
    getSoaId();

    return () => {
      setLoading(false);
      setSoaError(false);
    };
  }, []);

  return (
    <>
      {loading && (
        <Loading subtext="Generating you Request ..." color="black" />
      )}
      {soaError && (
        <LoadingWrapper>
          <SubTextBlack>Oops something went wrong</SubTextBlack>
          <Button onClick={getSoaId}>Try Again</Button>
        </LoadingWrapper>
      )}
      {soaId && (
        <>
          <NewRequestInnerHeader
            isError={isError}
            validateRef={validateRef}
            soaId={soaId}
          />
          <Content style={{ margin: "0 16px", minHeight: 360 }}>
            <NewRequestContent
              toggleError={toggleError}
              setValidateRef={setValidateRef}
            />
          </Content>
        </>
      )}
    </>
  );
};

export default NewRequest;
