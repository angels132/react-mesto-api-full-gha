import React from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import InfoTooltip from "./InfoTooltip";
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import EditProfilePopup from "./EditProfilePopup";
import AgreementPopup from "./AgreementPopup";
import ImagePopup from "./ImagePopup";
import projectApi from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import successImage from "../images/success.svg";
import failureImage from "../images/fail.svg";
import * as auth from "../utils/auth";

function App() {
  const [isEditProfilePopupOpen, setProfilePopupOpened] = React.useState(false);
  const [isAddPlacePopupOpen, setPlacePopupOpened] = React.useState(false);
  const [isEditAvatarPopupOpen, setAvatarPopupOpened] = React.useState(false);
  const [isAgreementAvatarOpen, setAgreementPopupOpened] =
    React.useState(false);
  const [isInfoTooltipOpen, setInfoTooltipOpened] = React.useState({
    opened: false,
    success: false,
  });
  const [currentPath, setCurrentPath] = React.useState("/");
  const [selectedCard, setSelectedCard] = React.useState({
    img: "",
    alt: "",
    opened: false,
  });

  // установка состояний: Пользователь, удаляемая карточка, массив карточек, email пользователя
  const [currentUser, setCurrentUser] = React.useState({});
  const [deletedCard, setDeletedCard] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [userEmail, setUserEmail] = React.useState("");

  // установка состояния авторизации пользователя
  const [loggedIn, setLoggedIn] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    auth
      .tokenCheck(localStorage.getItem("token"))
      .then((result) => {
        if (result) {
          setUserEmail(result.email);
          setLoggedIn(true);
          history.push("/");
          setCurrentPath('/');
        } else {
          throw new Error(
            "Ошибка текущего сеанса пользователя. Необходимо заново авторизироваться"
          );
        }
      })
      .catch((err) => {
        console.log(`Ошибка входа по токену ${err}`);
      });
  }, []);

  const handleEditProfileClick = () => {
    setProfilePopupOpened(true);
  };

  const handleEditAvatarClick = () => {
    setAvatarPopupOpened(true);
  };

  const handleAddPlaceLink = () => {
    setPlacePopupOpened(true);
  };

  const handleDeleteCardClick = (card) => {
    setAgreementPopupOpened(true);
    setDeletedCard(card);
  };

  const handleCardClick = (card) => {
    setSelectedCard({ src: card.link, alt: card.name, opened: true });
  };

  const handlePopupClose = (e) => {
    if (
      e.target.classList.contains("popup") ||
      e.target.classList.contains("popup__close-button")
    ) {
      closeAllPopups();
    }
  };

  const closeAllPopups = () => {
    setProfilePopupOpened(false);
    setAvatarPopupOpened(false);
    setPlacePopupOpened(false);
    setAgreementPopupOpened(false);
    setInfoTooltipOpened({ opened: false, success: false });
    setSelectedCard({ src: "", alt: "", opened: false });
  };

  const handlePathChange = (newPath) => {
    setCurrentPath(newPath);
  };

  //Функция замены карточек в массиве на новую
  const replaceCard = (newCard) => {
    const newCards = cards.map((card) =>
      card._id === newCard._id ? newCard : card
    );
    setCards(newCards);
  };

  //Обработчик нажатия кнопки "like"
  const handleCardLike = (card) => {
    if (card.likes.some((_id) => _id === currentUser._id))
      projectApi
        .deleteLike(card._id)
        .then((newCard) => replaceCard(newCard))
        .catch((err) => {
          console.log(`Ошибка ${err}`);
          alert("Ошибка сервера. Повторите действие позже");
        });
    else
      projectApi
        .putLike(card._id)
        .then((newCard) => replaceCard(newCard))
        .catch((err) => {
          console.log(`Ошибка ${err}`);
          alert("Ошибка сервера. Повторите действие позже");
        });
  };

  //Обработчик подтверждения удаления карточки
  const handleSubmitCardDelete = (card) => {
    projectApi
      .deleteCard(card._id)
      .then(() => {
        setCards((prevState) => prevState.filter((data) => data._id !== card._id));
        setAgreementPopupOpened(false);
      })
      .catch((err) => {
        setAgreementPopupOpened(false);
        console.log(`Ошибка ${err}`);
        alert("Ошибка сервера. Попробуйте повторить действие позже.");
      });
  };

  //Обработчик подтверждения изменения информации пользователя
  const handleUpdateUser = (name, about) => {
    projectApi
      .changeUserInfo(name, about)
      .then((newInfo) => {
        setCurrentUser(newInfo);
        setProfilePopupOpened(false);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
        alert("Ошибка сервера. Попробуйте повторить действие позже.");
      });
  };

  //Обработчик изменения аватара
  const handleAvatarUpdate = (newUrl) => {
    projectApi
      .changeAvatar(newUrl)
      .then((newInfo) => {
        setCurrentUser(newInfo);
        setAvatarPopupOpened(false);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
        alert("Ошибка сервера. Попробуйте повторить действие позже.");
      });
  };

  //Обработчик добавления карточки
  const handleAddPlaceSubmit = (name, link) => {
    projectApi
      .addCard(name, link)
      .then((card) => {
        setCards((cards) => [card, ...cards]);
        setPlacePopupOpened(false);
      })
      .catch((err) => {
        console.log(`Ошибка ${err}`);
        alert("Ошибка сервера. Попробуйте повторить действие позже.");
      });
  };

  //Обработчик подтверждения регистрации
  const handleSignupSubmit = (email, password) => {
    auth
      .register(email, password)
      .then((result) => {
        if (result) {
          setUserEmail(result.email);
          setInfoTooltipOpened({ opened: true, success: true });
          setLoggedIn(true);
          history.push("/sign-in");
          setCurrentPath("/sign-in");
        } else {
          throw new Error("Не удалось завершить регистрацию");
        }
      })
      .catch((err) => {
        console.log(`Ошибка регистрации пользователя: ${err}`);
        setInfoTooltipOpened({ opened: true, success: false });
      });
  };

  //Обработчик авторизации
  const handleSigninSubmit = (email, password) => {
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUserEmail(email);
          setLoggedIn(true);
          history.push("/");
          setCurrentPath("/");
        } else {
          throw new Error("Не удалось получить токен от сервера");
        }
      })
      .catch((err) => {
        alert(
          `Ошибка авторизации: ${err}. Проверьте корректность данных в полях Email и Пароль`
        );
      });
  };

  //Обработчик завершения сеанса
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserEmail("");
    setLoggedIn(false);
    history.push("/sign-in");
    setCurrentPath("/sign-in");
  };

  // получение данных о пользователе и массиве карточек при монтировании компонента
  React.useEffect(() => {
    if (loggedIn)
      Promise.all([projectApi.getUserInfo(), projectApi.getInitialCards()])
        .then(([userInfo, cardsArr]) => {
          setCurrentUser(userInfo);
          setCards(cardsArr);
        })
        .catch((err) => {
          console.log(`Ошибка ${err}`);
        });
  }, [loggedIn]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header
          userEmail={userEmail}
          onLogout={handleLogout}
          path={currentPath}
        />

        <Switch>
          <Route path="/sign-in">
            <Login
              onSignin={handleSigninSubmit}
              onPathChange={handlePathChange}
            />
          </Route>
          <Route path="/sign-up">
            <Register
              onSignup={handleSignupSubmit}
              onPathChange={handlePathChange}
            />
          </Route>
          <ProtectedRoute
            path="/"
            component={Main}
            onEditProfileClick={handleEditProfileClick}
            onEditAvatarClick={handleEditAvatarClick}
            onAddPlaceLink={handleAddPlaceLink}
            onCardClick={handleCardClick}
            onDeleteCardClick={handleDeleteCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            loggedIn={loggedIn}
          />
        </Switch>
        {loggedIn && <Footer />}

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={handlePopupClose}
          onUserUpdate={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={handlePopupClose}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        />

        <AgreementPopup
          name="agreement"
          title="Вы уверены?"
          submitButtonText="Да"
          isOpen={isAgreementAvatarOpen}
          onClose={handlePopupClose}
          deletedCard={deletedCard}
          onSubmit={handleSubmitCardDelete}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={handlePopupClose}
          onAvatarUpdate={handleAvatarUpdate}
        />
        <ImagePopup card={selectedCard} onClose={handlePopupClose} />
        <InfoTooltip
          isOpen={isInfoTooltipOpen.opened}
          onClose={handlePopupClose}
          statusImage={isInfoTooltipOpen.success ? successImage : failureImage}
          title={
            isInfoTooltipOpen.success
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз"
          }
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
