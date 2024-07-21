import React, { useState, useEffect } from "react";
import axios from "axios";

import { Container, Menu, Item } from "semantic-ui-react";
import { base_url, api_url } from "../../utils/base_url";
const Result = () => {
  const [activeTab, setActiveTab] = useState("Stats");

  const [thnxImg, setThnxImg] = useState(``);
  useEffect(() => {
    (async () => {
      const response = await axios.get(`${api_url}/site`);
      const result = response.data;
      const value = result?.find((item) => item.identifier == "joodah_thnx")?.value;
      if (value) {
        // setThnxImg(base_url + "/" + value);
        setThnxImg(
          base_url[base_url.length - 1] == `/` ? base_url + value : base_url + "/" + value
        );
      }
    })();
  }, []);

  const handleTabClick = (e, { name }) => {
    setActiveTab(name);
  };

  return (
    <Container>
      <div className=" h-screen flex justify-center items-center">
        <img className="  h-4/6  object-contain " src={thnxImg} />
      </div>
    </Container>
  );
};

export default Result;
