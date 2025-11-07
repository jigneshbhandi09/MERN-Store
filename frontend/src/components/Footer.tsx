import React from "react";

function Footer() {
  return (
    <footer
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        textAlign: "center",
        marginTop: "40px",
      }}
    >
      &copy; {new Date().getFullYear()} My Store. All rights reserved.
    </footer>
  );
}

export default Footer;
