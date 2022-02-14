import React, { useCallback, useRef } from "react";
import { FiArrowLeft, FiMail, FiUser, FiLock } from "react-icons/fi";
import { FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { Link, useHistory } from "react-router-dom";
import api from "../../services/api";

import { useToast } from "../../hooks/toast";

import getValidationErrors from "../../utils/getValidationErrors";

import { Container, Content, AnimationContainer, Background } from "./styles";
import logoImg from "../../assets/logo.svg";
import Input from "../../components/Input";
import Button from "../../components/Button";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      console.log(data);
      try {
        // eslint-disable-next-line no-unused-expressions
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required("Nome Obrigatório"),
          email: Yup.string()
            .required("E-mail obrigatório")
            .email("Digite um email válido"),
          password: Yup.string()
            .required("Senha obrigatória")
            .min(6, "No mínimo 6 digitos"),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post("/users", data);
        history.push("/");
        addToast({
          type: "success",
          title: "Cadastro realizado!",
          description: "Você já pode fazer seu logon no GoBarbe!",
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
          title: "Erro no Cadastro",
          description: "Ocorreu um erro ao fazer o cadastro, tente novamente",
        });
      }
    },
    [addToast, history]
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu Cadastro</h1>

            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              placeholder="Senha"
              type="password"
            />

            <Button type="submit">Cadastrar</Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para Logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
