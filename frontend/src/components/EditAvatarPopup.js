import React, { useState, useEffect, useRef } from "react";
import PopupWithForm from "./PopupWithForm";

function EditAvatarPopup(props) {
  const inputValue = useRef();
  const [urlError, setUrlError] = useState("Заполните это поле");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onAvatarUpdate(inputValue.current.value);
  };

  const handleChange = (e) => {
    if (!e.target.validity.valid) setUrlError(e.target.validationMessage);
    else setUrlError("");
  };

  useEffect(() => {
    setUrlError("Заполните это поле");
    inputValue.current.value = "";
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="avatar-change"
      title="Обновить аватар"
      submitButtonText="Сохранить"
      submitAvailable={!urlError} // Исправлено: использование !urlError вместо urlError ? false : true
      onSubmit={handleSubmit}
      {...props}
    >
      <input
        className="popup__item popup__item_type_name"
        id="input-avatar-url"
        type="url"
        name="user-avatar"
        placeholder="Ссылка на аватар"
        required
        ref={inputValue}
        value={inputValue.current?.value || ""}
        onChange={handleChange}
      />
      <span
        className={`popup__error ${urlError ? "popup__error_visible" : ""}`}
        id="input-url-error"
      >
        {urlError}
      </span>
    </PopupWithForm>
  );
}

export default EditAvatarPopup;