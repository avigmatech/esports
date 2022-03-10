import React, { useState } from "react";
import { Platform, StyleSheet, Keyboard } from "react-native";
import { useTheme } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Block, Text, Button, Logo, TextInput } from "../../../components";
import { theme as coreTheme } from "./../../../core/theme";
import { AuthStackNavigationProp } from "../models";

import Header from "../components/Header";
import { forgotPassword } from "../services/auth";
import { setSnackbarMessage } from "../../common/store";
import { useAppDispatch } from "../../../store";

type Props = {
  navigation: AuthStackNavigationProp;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please an enter valid email address.")
    .required("E-mail address is required."),
});

const ForgotPassword = ({ navigation }: Props) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError: setErrorForm,
  } = useForm<{ email: string }>({
    resolver: yupResolver(loginSchema),
  });
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (data: { email: string }) => {
    console.log(data.email, "data.email");

    Keyboard.dismiss();
    try {
      setLoading(true);

      // const formData = new FormData();
      // formData.append("email", data.email);

      const response = await forgotPassword(data);
      console.log(response, "response");

      dispatch(setSnackbarMessage("Please check your email address."));
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      // console.log(error.response.data);

      let message = "";
      if (error.response) {
        const {
          data: { Message },
        } = error.response;
        if (Message) {
          setErrorForm("email", { message: Message });
        } else {
          message = "An error occurred while processing your request.";
        }
      } else if (error.request) {
        message = "An error occurred while processing your request.";
      } else {
        message = "An error occurred while processing your request.";
      }

      if (message) {
        setErrorForm("email", { message: message });
      }

      setLoading(false);
    }
  };

  const hasError = (field: string) => {
    return errors.hasOwnProperty(field);
  };

  return (
    <Block color={theme.colors.background} style={styles.container}>
      <Header goBack={() => navigation.goBack()} />
      <Block flex>
        <Block noflex center marginVertical={75}>
          <Logo />
        </Block>
        <Block noflex paddingHorizontal={30}>
          <Block noflex>
            <Text color={theme.colors.text}>Email Address</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your email"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("email")}
                  errorText={errors?.email?.message}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                />
              )}
              name="email"
              rules={{ required: true }}
              defaultValue=""
            />
          </Block>
          <Block noflex>
            <Button
              mode="contained"
              uppercase={false}
              labelStyle={{ color: coreTheme.colors.text }}
              onPress={handleSubmit(handleForgotPassword)}
              loading={loading}
              disabled={loading}>
              Request Password
            </Button>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 45 : 0,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
  },
});
