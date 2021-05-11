import React from "react";
import PropTypes from "prop-types";
const Progress = ({ percentage }) => {
  return (
    <div>
      <div role="ProgressBar" style={{ width: "${percentage}%" }} />
      {percentage}%
    </div>
  );
};
Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
};
export default Progress;
