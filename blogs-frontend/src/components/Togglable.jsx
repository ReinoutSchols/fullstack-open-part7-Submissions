import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
const Togglable = (props) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  Togglable.propTypes = {
    buttonLabel: PropTypes.string.isRequired,
  };
  return (
    <div>
      <div style={hideWhenVisible}>
        <Button onClick={toggleVisibility} variant="primary">
          {props.buttonLabel}{" "}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button onClick={toggleVisibility} variant="danger">
          cancel
        </Button>
      </div>
    </div>
  );
};

export default Togglable;
