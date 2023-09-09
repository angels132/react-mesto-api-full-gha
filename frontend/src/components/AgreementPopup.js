import React from "react";
import PopupWithForm from "./PopupWithForm";

function AgreementPopup(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSubmit(props.deletedCard);
  };

  return (
    <PopupWithForm
      name={props.name}
      title={props.title}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onSubmit={handleSubmit}
      submitAvailable={true}
      submitButtonText={props.submitButtonText}
    />
  );
}

export default AgreementPopup;
