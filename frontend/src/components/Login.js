import React from "react";
import { Link } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handlePathChange = (newPath) => {
    props.onPathChange(newPath);
  };

  React.useEffect(() => {
    handlePathChange("/sign-in");
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSigninSubmit = (e) => {
    e.preventDefault();
    props.onSignin(email, password);
  };

  return (
    <form className="form" onSubmit={handleSigninSubmit}>
      <h1 className="form__title">Вход</h1>
      <input
        type="email"
        value={email}
        onChange={handleEmailChange}
        id="sign-in-email"
        className="form__item"
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
        id="sign-in-password"
        className="form__item form__item_second"
        placeholder="Пароль"
        required
      />
      <button type="submit" className="default-button form__submit-button">
        Войти
      </button>
      <p className="form__caption">
        Ещё не зарегистрированы?{" "}
        <Link className="default-link form__link" to="/sign-up">
          Регистрация
        </Link>
      </p>
    </form>
  );
}

export default Login;
