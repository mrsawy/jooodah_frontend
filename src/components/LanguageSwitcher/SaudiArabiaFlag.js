import React from "react";
import saudiImage from "./../../images/saudi-arabia-flag-icon.png";

function SaudiArabiaFlag() {
  return (
    <div className="  w-4 h-4 rounded-full overflow-hidden  me-2">
      <img src={saudiImage} className="object-cover h-full" />
    </div>
  );
}

export default SaudiArabiaFlag;
