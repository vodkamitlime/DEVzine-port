import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { signinUser } from '../../../_actions/user_actions';
import TextInputGenderRequired from './TextInputGenderRequired';
import Button from '../Button/Button';
import { Link } from 'react-router-dom';
import AlertModal from '../AlertModal/AlertModal';

function SigninModal({ ModalOpen, setModalOpen }) {
  const dispatch = useDispatch();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [AlertOpen, setAlertOpen] = useState(false);
  const requiredTextInputData = [
    [Email, setEmail, '이메일 입력', 'email', '30'],
    [Password, setPassword, '비밀번호 입력', 'password', '20'],
  ];

  async function postHandler(e) {
    let body = {
      user_email: Email,
      user_password: Password,
    };

    dispatch(signinUser(body))
      .then(res => {
        if (res.payload[0] === 'Login success') {
          window.location.reload();
        } else {
          alert('로그인 실패하였습니다.');
        }
      })
      .catch(err => {
        setAlertOpen(true);
      });
  }

  function closeModal() {
    setAlertOpen(false);
  }

  return ModalOpen ? (
    <div className="signincontainer">
      <div className="signinwrapper">
        <div className="signinheader">DEVzine</div>
        <Link to="/">
          <svg
            className="backbtn"
            onClick={() => setModalOpen(false)}
            width="39"
            height="39"
            viewBox="0 0 39 39"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M30.3993 10.8993C31.0339 10.2647 31.0339 9.2358 30.3993 8.6012C29.7647 7.96659 28.7358 7.96659 28.1012 8.6012L19.5002 17.2021L10.8993 8.6012C10.2647 7.96659 9.2358 7.96659 8.6012 8.6012C7.96659 9.2358 7.96659 10.2647 8.6012 10.8993L17.2021 19.5002L8.6012 28.1012C7.96659 28.7358 7.96659 29.7647 8.6012 30.3993C9.2358 31.0339 10.2647 31.0339 10.8993 30.3993L19.5002 21.7983L28.1012 30.3993C28.7358 31.0339 29.7647 31.0339 30.3993 30.3993C31.0339 29.7647 31.0339 28.7358 30.3993 28.1012L21.7983 19.5002L30.3993 10.8993Z"
              fill="#D9D9D9"
            />
          </svg>
        </Link>
        {requiredTextInputData.map((el, idx) => {
          return (
            <TextInputGenderRequired
              key={`SignInTextInputGender${idx}`}
              stateName={el[0]}
              stateFunc={el[1]}
              placeholder={el[2]}
              type={el[3]}
              maxLength={el[4]}
            />
          );
        })}
        <Button
          subject={`로그인`}
          color={`#ffffff`}
          backgroundColor={`#191A20`}
          onClickHandle={postHandler}
        />
        <div className="leadsignup">아직 회원이 아니신가요?</div>
        <span className="sm-only">
          <Button
            subject={`회원가입`}
            color={`#191A20`}
            backgroundColor={`#FFDD14`}
            onClickHandle={() => {
              setModalOpen(false);
              window.location.href = '/signup';
            }}
          />
        </span>
        <span className="sm-hidden">
          <Link to="/signup">
            <Button
              subject={`회원가입`}
              color={`#191A20`}
              backgroundColor={`#FFDD14`}
              onClickHandle={() => setModalOpen(false)}
            />
          </Link>
        </span>
      </div>
      <AlertModal
        open={AlertOpen}
        close={closeModal}
        alertString={'아이디 혹은 비밀번호가\n일치하지 않습니다.'}
        alertBtn="확인"
      />
    </div>
  ) : null;
}

export default SigninModal;
