import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
  Keyboard,
  Linking,
} from "react-native";
import {
  ActivityIndicator,
  HelperText,
  IconButton,
  useTheme,
} from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Feather";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Header from "../components/Header";
import { Block, Text, Button, TextInput } from "../../../components";
import { theme as coreTheme } from "./../../../core/theme";
import {
  AuthStackNavigationProp,
  CreateAccountData,
  IUsernameExists,
} from "../models";
import { checkUsername, register } from "../services/auth";
import { useAppDispatch } from "../../../store";
import { setSnackbarMessage } from "../../common/store";
import { useToast } from "react-native-paper-toast";

type Props = {
  navigation: AuthStackNavigationProp;
};

// yup.addMethod(yup.string, "usernameExists", function (message) {
//   return this.test("usernameExists", message, async function (value) {
//     const { path, createError } = this;

//     if (value) {
//       try {
//         const { exists }: IUsernameExists = await checkUsername(value.trim());

//         if (exists) {
//           return createError({
//             path,
//             message: message ?? "Username is already in use.",
//           });
//         }
//       } catch (error) {
//         console.log({ error });

//         return createError({
//           path,
//           message: message ?? "Unable to check username.",
//         });
//       }
//     }

//     return true;
//   });
// });

const registerSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .matches(/^[a-zA-Z0-9\-_]{0,40}$/, "Username must be alphanumeric"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character",
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  email: yup.string().email().required("Email is required"),
  streamUrl: yup.string().url("Please enter valid stream url"),
});

const Login = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError: setErrorForm,
    clearErrors,
  } = useForm<CreateAccountData>({
    resolver: yupResolver(registerSchema),
  });

  const theme = useTheme();
  const toaster = useToast();

  const [loading, setLoading] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [confirmPasswordReveal, setConfirmPasswordReveal] = useState(false);

  const handleRegister = async (data: CreateAccountData) => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      delete data.confirmPassword;
      const response = await register(data);
      setLoading(false);
      dispatch(
        setSnackbarMessage("Your account has been created. Please login."),
      );
      navigation.goBack();
    } catch (error) {
      console.log({ error: error.response.data });

      let message = "";
      if (error.response) {
        const {
          data: { Message },
        } = error.response;
        if (Message) {
          toaster.show({
            message: Message,
            type: "error",
            duration: 5000,
            position: "top",
          });
        } else {
          message = "An error occurred while processing your request.";
        }
      } else if (error.request) {
        message = "An error occurred while processing your request.";
      } else {
        message = "An error occurred while processing your request.";
      }

      if (message) {
        toaster.show({
          message: message,
          type: "error",
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);
    }
  };

  const handleUsernameCheck = async (username: string) => {
    setUsernameAvailable(false);
    console.log(username, "username");

    if (!username.match(/^[a-zA-Z0-9\-_]{0,40}$/)) {
      setErrorForm("username", { message: "Username must be alphanumeric" });
      return false;
    }
    setUsernameLoading(true);
    clearErrors("username");
    try {
      if (username.trim()) {
        const { exists }: IUsernameExists = await checkUsername(
          username.trim(),
        );
        if (exists) {
          setErrorForm("username", { message: "Username already in use." });
        } else {
          setUsernameAvailable(true);
        }
        setUsernameLoading(false);
      } else {
        setUsernameLoading(false);
      }
    } catch (error) {
      console.log("hiiii9");
      console.log({ error });
      setUsernameLoading(false);
    }
  };

  const hasError = (field: string) => {
    return errors.hasOwnProperty(field);
  };

  React.useEffect(() => {
    console.log("usernameAvailable", !usernameAvailable);

    return () => {};
  });
  return (
    <ScrollView
      style={{
        backgroundColor: coreTheme.colors.background,
      }}>
      <Block color={theme.colors.background} style={styles.container}>
        <Header
          goBack={() => navigation.goBack()}
          title={
            <Text color={theme.colors.text} h2 bold>
              CREATE ACCOUNT
            </Text>
          }
        />
        <Block noflex marginTop={20}>
          <Block noflex paddingHorizontal={30} marginBottom={10}>
            <Text color={theme.colors.text}>Username</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your username"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("username")}
                  errorText={errors?.username?.message}
                  autoCapitalize="none"
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  onEndEditing={(event: any) =>
                    handleUsernameCheck(event.nativeEvent.text)
                  }
                  right={
                    usernameLoading ? (
                      <ActivityIndicator
                        color="#ffffff"
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 100,
                        }}
                      />
                    ) : usernameAvailable ? (
                      <Icon
                        name="check"
                        color={"green"}
                        size={25}
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          zIndex: 100,
                        }}
                      />
                    ) : null
                  }
                />
              )}
              name="username"
              rules={{ required: true }}
              defaultValue=""
            />
          </Block>
          <Block noflex paddingHorizontal={30} marginBottom={10}>
            <Text color={theme.colors.text}>Password</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your Password"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("password")}
                  errorText={errors?.password?.message}
                  secureTextEntry={!passwordReveal}
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  right={
                    <IconButton
                      icon={props => (
                        <Icon
                          name={!passwordReveal ? "eye-off" : "eye"}
                          {...props}
                        />
                      )}
                      onPress={() => setPasswordReveal(!passwordReveal)}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 100,
                      }}
                    />
                  }
                />
              )}
              name="password"
              rules={{ required: true }}
              defaultValue=""
            />
          </Block>
          <Block noflex paddingHorizontal={30} marginBottom={10}>
            <Text color={theme.colors.text}>Confirm Password</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your Password"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("confirmPassword")}
                  errorText={errors?.confirmPassword?.message}
                  secureTextEntry={!confirmPasswordReveal}
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  right={
                    <IconButton
                      icon={props => (
                        <Icon
                          name={!confirmPasswordReveal ? "eye-off" : "eye"}
                          {...props}
                        />
                      )}
                      onPress={() =>
                        setConfirmPasswordReveal(!confirmPasswordReveal)
                      }
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        zIndex: 100,
                      }}
                    />
                  }
                />
              )}
              name="confirmPassword"
              rules={{ required: true }}
              defaultValue=""
            />
          </Block>
          <Block noflex paddingHorizontal={30} marginBottom={10}>
            <Text color={theme.colors.text}>Email</Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your Email"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("email")}
                  errorText={errors?.email?.message}
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  autoCapitalize="none"
                  autoCompleteType="email"
                  textContentType="emailAddress"
                  keyboardType="email-address"
                />
              )}
              name="email"
              rules={{ required: true }}
              defaultValue=""
            />
            <HelperText type="info" style={{ paddingLeft: 0 }}>
              Your email will not be given or sold to anyone.
            </HelperText>
          </Block>
          <Block
            noflex
            paddingHorizontal={30}
            paddingVertical={20}
            marginBottom={10}
            // style={{ backgroundColor: "#03152f" }}
          >
            <Text color={theme.colors.text}>
              Stream URL (include the https://)
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your Stream URL"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("streamUrl")}
                  errorText={errors?.streamUrl?.message}
                  inputStyle={[
                    styles.textInput,
                    // { backgroundColor: "#03152f" },
                  ]}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  autoCapitalize="none"
                />
              )}
              name="streamUrl"
              rules={{ required: false }}
              defaultValue=""
            />
            <HelperText type="info" style={{ paddingLeft: 0 }}>
              To promote your stream.
            </HelperText>
          </Block>
          <Block noflex paddingHorizontal={30} center marginVertical={10}>
            <Block row noflex>
              <Text color={theme.colors.text} size={12}>
                By signing up, you agree to the.{" "}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL("https://vrmasterleague.com/TermsOfUse.aspx")
                }>
                <Block
                  noflex
                  style={{
                    borderBottomWidth: 2,
                    borderBottomColor: theme.colors.primary,
                  }}>
                  <Text color={theme.colors.primary} size={12}>
                    Terms of Use
                  </Text>
                </Block>
              </TouchableOpacity>
            </Block>
            <Button
              mode="contained"
              uppercase={false}
              labelStyle={{ color: coreTheme.colors.text }}
              onPress={
                !usernameAvailable ? () => {} : handleSubmit(handleRegister)
              }
              loading={loading}
              disabled={!usernameAvailable || loading}>
              Create Account
            </Button>
          </Block>
        </Block>
        <Block noflex center>
          <Block row noflex>
            {/* <Text color={theme.colors.text}>I'm already a member. </Text> */}
            <Text color={theme.colors.text}>Already a member? </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Block
                noflex
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: theme.colors.primary,
                }}>
                <Text color={theme.colors.primary}>Sign In</Text>
              </Block>
            </TouchableOpacity>
          </Block>
        </Block>
      </Block>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 40 : 0,
    paddingBottom: 40,
  },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
});
