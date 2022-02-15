import React, { useRef, useCallback, useState } from "react";
import { FiLogIn, FiMail } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import getValidationErrors from "../../utils/getValidationErrors";

import { Container, Content, AnimationContainer, Background } from "./styles";

import logoImg from "../../assets/logo.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";
import api from "../../services/api";
// import { useCallback, useRef } from "react";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  // formRef.current.
  const { user } = useAuth();
  const { addToast } = useToast();

  console.log(user);
  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(
    // eslint-disable-next-line @typescript-eslint/ban-types
    async (data: ForgotPasswordFormData) => {
      try {
        setLoading(true);
        // eslint-disable-next-line no-unused-expressions
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um email válido"),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        // eslint-disable-next-line

        await api.post("/password/forgot", {
          email: data.email,
        });

        addToast({
          type: "success",
          title: "E-mail de recuperação enviado",
          description:
            "Enviamos um e-mail para confiemar a recuperação de senha, cheque sua caixa de entrada",
        });

        // history.push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err as Yup.ValidationError);
          // eslint-disable-next-line no-unused-expressions
          formRef.current?.setErrors(errors);
          console.log(errors);
        }

        addToast({
          type: "error",
          title: "Erro na recuperação de senha",
          description:
            "Ocorreu um erro ao tentar realizar a recuperação de senha",
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast]
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar Senha</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Button loading={loading} type="submit">Recuperar</Button>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            Voltar ao login
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default ForgotPasswordForm;
