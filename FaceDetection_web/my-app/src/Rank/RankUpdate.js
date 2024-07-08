// import React from "react";

const RankUpdate = (id) => {
  fetch("http://localhost:3004/image", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: id,
    }),
  });
};

export default RankUpdate;
