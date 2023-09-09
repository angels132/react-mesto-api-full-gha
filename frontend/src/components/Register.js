import React from "react";
import { Link } from "react-router-dom";

function Register(props) {
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSignup(email, password);
  };

  const handlePathChange = (newPath) => {
    props.onPathChange(newPath);
  };

  React.useEffect(() => {
    handlePathChange("/sign-up");
  }, []);

  return (
    <div>
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="form__title">Регистрация</h1>
        <input
          type="email"
          id="sign-in-email"
          className="form__item"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          type="password"
          id="sign-in-password"
          className="form__item form__item_second"
          placeholder="Пароль"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit" className="default-button form__submit-button">
          Регистрация
        </button>
        <p className="form__caption">
          Уже зарегистрированы?{" "}
          <Link className="default-link form__link" to="/sign-in">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
