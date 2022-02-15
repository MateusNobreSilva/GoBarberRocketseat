import React, { useRef, useCallback } from "react";
import { FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useHistory, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import { Container, Content, AnimationContainer, Background } from "./styles";

import logoImg from "../../assets/logo.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
// import { useCallback, useRef } from "react";

interface ResetPasswordFormData {
  password: string;
  // eslint-disable-next-line camelcase
  password_confirmation: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  // formRef.current.
  const { user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();
  console.log(location);
  console.log(user);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    async (data: ResetPasswordFormData) => {
      try {
        // eslint-disable-next-line no-unused-expressions
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          password: Yup.string().required("Senha obrigatória"),
          // eslint-disable-next-line @typescript-eslint/camelcase
          password_confirmation: Yup.string().oneOf(
            [Yup.ref("password"), null],
            "Confirmação incorreta"
          ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        // history.push("/dashboard");

        // eslint-disable-next-line camelcase
        const { password, password_confirmation } = data;
        const token = location.search.replace("?token=", "");

        if (!token) {
          throw new Error();
        }

        await api.post("/password/reset", {
          password,
          password_confirmation,
          token,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          console.log(errors);
        }

        addToast({
          type: "error",
          title: "Erro ao resetar senha",
          description: "Ocorreu um erro resetar sua senha, tente novamente",
        });
      }
    },
    [addToast, history, location.search]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Resetar senha</h1>

            <Input
              name="password"
              icon={FiLock}
              placeholder="Nova Senha"
              type="password"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              placeholder="Confirmação da senha"
              type="password"
            />

            <Button type="submit">Alterar senha</Button>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
