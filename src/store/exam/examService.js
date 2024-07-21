/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable */

import axios from "axios";
import { api_url } from "../../utils/base_url";

export const getExamDataService = async () => {
  try {
    const response = await axios.get(`${api_url}/level`);
    // console.log(response.data);
    return response.data;
  } catch (e) {
    console.log(`err=>`, e);
  }
};
