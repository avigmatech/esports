import { useFocusEffect } from "@react-navigation/core";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  HelperText,
  useTheme,
  Checkbox,
  Switch,
  IconButton,
  Avatar,
  ActivityIndicator,
} from "react-native-paper";
import { Alert, Keyboard, Platform, StyleSheet } from "react-native";
import { TimePickerModal } from "react-native-paper-dates";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import React, { useCallback, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

import { Block, Button, Text, TextInput } from "../../../components";
import { RootState, useAppDispatch, useAppSelector } from "../../../store";
import {
  IPatchJson,
  IUpdateTeam,
  SettingsStackNavigationProp,
  Team,
} from "../models";
import { getTeamById, getTeamPlayerByUserId, isRoleExist } from "../store";
import { theme as coreTheme } from "./../../../core/theme";
import { resolveImage } from "../../../utils";
import ActionSheet from "@alessiocancian/react-native-actionsheet";
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from "react-native-image-picker";
import { setSnackbarMessage } from "../../common/store";
import { modifyTeam, updateTeamsLogo } from "../services";
import { User } from "../../auth/models";
import dayjs from "dayjs";
import { getCurrentUser, getToken } from "../../auth/store";
import { getLeagueRegions, loadRegionsByLeague } from "../../tournaments/store";

type Props = {
  navigation: SettingsStackNavigationProp;
  route: any;
};

const teamDetailsSchema = yup.object().shape({
  name: yup.string().required("Team name is required"),
  region: yup.string().nullable(),
  active: yup.bool(),
  recruiting: yup.bool(),
  blockingRecruit: yup.bool(),
  retire: yup.bool(),
  scrim: yup.bool(),
  weekdays: yup.object().shape({
    start: yup.string(),
    // .date()
    // .nullable()
    // .transform((curr, orig) =>
    //   orig === "" ? null : dayjs(curr).format("HH:mm"),
    // ),
    end: yup.string(),
    // .date()
    // .min(yup.ref("start"))
    // .nullable()
    // .transform((curr, orig) =>
    //   orig === "" ? null : dayjs(curr).format("HH:mm"),
    // ),
  }),
  weekends: yup.object().shape({
    start: yup.string(),
    // .date()
    // .nullable()
    // .transform((curr, orig) => (orig === "" ? null : curr)),
    end: yup.string(),
    // .date()
    // .min(yup.ref("start"))
    // .nullable()
    // .transform((curr, orig) => (orig === "" ? null : curr)),
  }),
  bio: yup.object().shape({
    bioInfo: yup.string().max(2000, "2000 characters are allowed"),
    discordServer: yup.string(),
  }),
});

const MyTeamsDetails = ({ navigation, route }: Props) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const team: Team = useAppSelector((state: RootState) =>
    getTeamById(state, route.params.teamId),
  )!;

  const user: User = useAppSelector(getCurrentUser)!;
  const regions = useAppSelector(getLeagueRegions);

  const isOwner = useAppSelector((state: RootState) =>
    isRoleExist(state, route.params.teamId, user.id!, "Team Owner"),
  );

  const isStarter = useAppSelector((state: RootState) =>
    isRoleExist(state, route.params.teamId, user.id!, "Starter"),
  );

  const token: string = useAppSelector(getToken)!;

  const logoRef = useRef<ActionSheet>(null);
  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const [wdaysStartVisible, setWDaysStartVisible] = useState(false);
  const [wdaysEndVisible, setWDaysEndVisible] = useState(false);
  const [wendsStartVisible, setWEndsStartVisible] = useState(false);
  const [wendsEndVisible, setWEndsEndVisible] = useState(false);
  const [timezone, setTimeZone] = useState("");

  const onDismissWDaysStart = useCallback(() => {
    setWDaysStartVisible(false);
  }, [wdaysStartVisible]);
  const onConfirmWDaysStart = useCallback(
    ({ hours, minutes }) => {
      setWDaysStartVisible(false);
      setValue("weekdays.start", `${hours}:${minutes}`);
    },
    [wdaysStartVisible],
  );

  const onDismissWDaysEnd = useCallback(() => {
    setWDaysEndVisible(false);
  }, [wdaysStartVisible]);
  const onConfirmWDaysEnd = useCallback(
    ({ hours, minutes }) => {
      setWDaysEndVisible(false);
      setValue("weekdays.end", `${hours}:${minutes}`);
    },
    [wdaysEndVisible],
  );

  const onDismissWEndsStart = useCallback(() => {
    setWEndsStartVisible(false);
  }, [wdaysStartVisible]);
  const onConfirmWEndsStart = useCallback(
    ({ hours, minutes }) => {
      setWEndsStartVisible(false);
      setValue("weekends.start", `${hours}:${minutes}`);
    },
    [wendsStartVisible],
  );

  const onDismissWEndsEnd = useCallback(() => {
    setWEndsEndVisible(false);
  }, [wendsEndVisible]);
  const onConfirmWEndsEnd = useCallback(
    ({ hours, minutes }) => {
      setWEndsEndVisible(false);
      setValue("weekends.end", `${hours}:${minutes}`);
    },
    [wendsEndVisible],
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError: setErrorForm,
    clearErrors,
    setValue,
  } = useForm<IUpdateTeam>({
    resolver: yupResolver(teamDetailsSchema),
    defaultValues: {
      name: team?.name,
      region: team?.region,
      active: team?.active,
      recruiting: false,
      blockingRecruit: false,
      retire: team?.retired,
      scrim: false,
      weekdays: {
        start: undefined,
        end: undefined,
      },
      weekends: {
        start: undefined,
        end: undefined,
      },
    },
  });

  React.useEffect(() => {
    var d = new Date();
    var n = d
      .toTimeString("en-us", { timeZone: "UTC", timeZoneName: "short" })
      .split(" ")
      .slice(2, 5);
    const Zone = n.map(value => value[0].replace("(", value[1]));
    setTimeZone(Zone);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      navigation.setOptions({
        headerTitle: `Edit ${route.params.teamName}`,
      });

      if (team) {
        dispatch(loadRegionsByLeague(team.game));
      }

      return () => {
        mounted = false;
      };
    }, []),
  );

  const hasError = (field: string) => {
    return errors.hasOwnProperty(field);
  };

  const handleUpdateTeamDetails = async (data: IUpdateTeam) => {
    console.log(data, "datata");

    if (isOwner || isStarter) {
      Keyboard.dismiss();
      setLoading(true);
      try {
        const patchReq: IPatchJson[] = [];
        if (isOwner) {
          patchReq.push({ op: "replace", path: "/name", value: data.name });
        }

        if (isStarter) {
          patchReq.push({ op: "replace", path: "/active", value: data.active });
          patchReq.push({
            op: "replace",
            path: "/recruiting",
            value: data.recruiting,
          });
          patchReq.push({
            op: "replace",
            path: "/blockingRecruit",
            value: data.blockingRecruit,
          });
          patchReq.push({ op: "replace", path: "/retire", value: data.retire });

          // patchReq.push({ op: "replace", path: "/scrim", value: data.scrim });

          patchReq.push({
            op: "replace",
            path: "/weekdays",
            value: {
              start: data.weekdays.start,
              end: data.weekdays.end,
            },
          });
          patchReq.push({
            op: "replace",
            path: "/weekends",
            value: {
              start: data.weekends.start,
              end: data.weekends.end,
            },
          });
        }

        const response = await modifyTeam(team.id!, patchReq);
        setLoading(false);
        dispatch(
          setSnackbarMessage("Team details has been updated successfully."),
        );
        navigation.goBack();
      } catch (error) {
        let message = "Unable to update team details.";
        setLoading(false);
        if (error.response) {
          console.log(error.response.data);
          const { Message } = error.response.data;
          if (Message) {
            message = Message;
          }
        } else if (error.request) {
        } else {
        }

        dispatch(setSnackbarMessage(message));
      }
    } else {
      Alert.alert(
        "Info",
        "Only owner and starter player are allowed to udpate details.",
      );
    }
  };

  const createFormData = (photo: ImagePickerResponse) => {
    const data = new FormData();
    if (photo.uri) {
      data.append("image", {
        name: photo.fileName,
        type: photo.type,
        uri:
          Platform.OS === "android"
            ? photo.uri
            : photo.uri.replace("file://", ""),
      });
    }

    return data;
  };

  const handleUploadLogo = async (image: ImagePickerResponse) => {
    setLogoLoading(true);
    try {
      const formData = createFormData(image);
      const response = await updateTeamsLogo(team.id, formData, token);
      // Fetch logo and update in store
      setLogoLoading(false);
      dispatch(setSnackbarMessage("Logo has been updated successfully."));
    } catch (error) {
      setLogoLoading(false);
      dispatch(setSnackbarMessage("Unable to upload logo."));
      console.log(error.response);
    }
  };

  const openCamera = () => {
    try {
      launchCamera(
        {
          mediaType: "photo",
          cameraType: "front",
          maxHeight: 1024,
          maxWidth: 1024,
        },
        (response: ImagePickerResponse) => {
          handleUploadLogo(response);
        },
      );
    } catch (error) {}
  };

  const openGallery = () => {
    try {
      launchImageLibrary(
        {
          mediaType: "photo",
          maxHeight: 1024,
          maxWidth: 1024,
        },
        (response: ImagePickerResponse) => {
          handleUploadLogo(response);
        },
      );
    } catch (error) {}
  };

  const renderTimePickers = () => {
    return (
      <React.Fragment>
        <TimePickerModal
          visible={wdaysStartVisible}
          onDismiss={onDismissWDaysStart}
          onConfirm={onConfirmWDaysStart}
        />
        <TimePickerModal
          visible={wdaysEndVisible}
          onDismiss={onDismissWDaysEnd}
          onConfirm={onConfirmWDaysEnd}
        />
        <TimePickerModal
          visible={wendsStartVisible}
          onDismiss={onDismissWEndsStart}
          onConfirm={onConfirmWEndsStart}
        />
        <TimePickerModal
          visible={wendsEndVisible}
          onDismiss={onDismissWEndsEnd}
          onConfirm={onConfirmWEndsEnd}
        />
      </React.Fragment>
    );
  };

  const renderLogoLoader = () => {
    if (!logoLoading) return null;
    return (
      <Block
        noflex
        style={{
          position: "absolute",
          top: "0%",
          left: "0%",
          backgroundColor: theme.colors.backdrop,
          width: 100,
          height: 100,
          borderRadius: 100,
        }}>
        <Block center middle>
          <ActivityIndicator size={"small"} />
        </Block>
      </Block>
    );
  };

  const renderActionSheet = () => {
    return (
      <ActionSheet
        ref={logoRef}
        options={["Open Camera", "Choose Photo", "Cancel"]}
        cancelButtonIndex={2}
        onPress={index => {
          switch (index) {
            case 0: {
              openCamera();
            }
            case 1: {
              openGallery();
            }
          }
        }}
      />
    );
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      nestedScrollEnabled={true}>
      <Block flex>
        <Block noflex center paddingHorizontal={20} paddingVertical={10}>
          {team!.logo ? (
            <Block noflex>
              <Block noflex>
                <Avatar.Image
                  size={100}
                  source={{
                    uri: resolveImage(team!.logo),
                  }}
                />
                <IconButton
                  icon="pencil"
                  size={25}
                  onPress={() => logoRef.current?.show()}
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    borderRadius: 50,
                    backgroundColor: theme.colors.backdrop,
                  }}
                />
              </Block>
              {renderLogoLoader()}
            </Block>
          ) : null}
        </Block>
        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={10}
          style={{ zIndex: 3000 }}>
          <Block noflex middle>
            <Block noflex marginBottom={10}>
              <Text color={theme.colors.text}>Team Name</Text>
            </Block>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Your Team Name"
                  returnKeyType="next"
                  value={value}
                  onChangeText={value => onChange(value)}
                  error={hasError("username")}
                  errorText={errors?.name?.message}
                  autoCapitalize="none"
                  inputStyle={styles.textInput}
                  placeholderTextColor="#adadad"
                  containerStyle={styles.textInputContainer}
                  editable={isOwner}
                />
              )}
              name="name"
              rules={{ required: true }}
              defaultValue=""
            />
            {errors?.name?.message ? (
              <HelperText type="error" style={styles.error}>
                {errors?.name?.message}
              </HelperText>
            ) : null}
          </Block>
        </Block>
        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={20}
          style={{ zIndex: 3000 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Block noflex row center>
                  <Block noflex marginRight={10}>
                    {Platform.OS === "ios" ? (
                      <Switch
                        disabled={!isStarter}
                        value={!!value}
                        onValueChange={() => onChange(!value)}
                      />
                    ) : (
                      <Checkbox
                        disabled={!isStarter}
                        status={value ? "checked" : "unchecked"}
                        onPress={() => {
                          onChange(!value);
                        }}
                      />
                    )}
                  </Block>
                  <Block>
                    <Text>Is active and participating weekly</Text>
                  </Block>
                </Block>
              );
            }}
            name="active"
            rules={{ required: true }}
            defaultValue=""
          />
        </Block>
        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={20}
          style={{ zIndex: 3000 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Block noflex row center>
                  <Block noflex marginRight={10}>
                    {Platform.OS === "ios" ? (
                      <Switch
                        disabled={!isStarter}
                        value={!!value}
                        onValueChange={() => onChange(!value)}
                      />
                    ) : (
                      <Checkbox
                        disabled={!isStarter}
                        status={value ? "checked" : "unchecked"}
                        onPress={() => {
                          onChange(!value);
                        }}
                      />
                    )}
                  </Block>
                  <Block>
                    <Text>Is recruiting</Text>
                  </Block>
                </Block>
              );
            }}
            name="recruiting"
            rules={{ required: true }}
            defaultValue=""
          />
        </Block>
        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={20}
          style={{ zIndex: 3000 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Block noflex row center>
                  <Block noflex marginRight={10}>
                    {Platform.OS === "ios" ? (
                      <Switch
                        disabled={!isStarter}
                        value={!!value}
                        onValueChange={() => onChange(!value)}
                      />
                    ) : (
                      <Checkbox
                        disabled={!isStarter}
                        status={value ? "checked" : "unchecked"}
                        onPress={() => {
                          onChange(!value);
                        }}
                      />
                    )}
                  </Block>
                  <Block>
                    <Text>Is blocking any recruiting requests</Text>
                  </Block>
                </Block>
              );
            }}
            name="blockingRecruit"
            rules={{ required: true }}
            defaultValue=""
          />
        </Block>
        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={20}
          style={{ zIndex: 3000 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Block noflex row center>
                  <Block noflex marginRight={10}>
                    {Platform.OS === "ios" ? (
                      <Switch
                        disabled={!isStarter}
                        value={!!value}
                        onValueChange={() => onChange(!value)}
                      />
                    ) : (
                      <Checkbox
                        disabled={!isStarter}
                        status={value ? "checked" : "unchecked"}
                        onPress={() => {
                          onChange(!value);
                        }}
                      />
                    )}
                  </Block>
                  <Block>
                    <Text>Retire from league play</Text>
                  </Block>
                </Block>
              );
            }}
            name="retire"
            rules={{ required: true }}
            defaultValue=""
          />
        </Block>

        <Block noflex paddingHorizontal={15} marginBottom={20}>
          <Block noflex marginBottom={10}>
            <Text color={theme.colors.text}>Availability on weekdays:</Text>
          </Block>
          <Block flex row>
            <Block noflex style={{ width: "45%" }} marginRight={10}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <>
                    <TextInput
                      placeholder=""
                      returnKeyType="next"
                      value={value}
                      onChangeText={value => onChange(value)}
                      error={hasError("weekdays")}
                      errorText={errors?.weekdays?.message}
                      autoCapitalize="none"
                      inputStyle={styles.textInput}
                      placeholderTextColor="#adadad"
                      containerStyle={styles.textInputContainer}
                      editable={false}
                      right={
                        value ? (
                          <IconButton
                            icon={props => (
                              <Icon name="highlight-remove" {...props} />
                            )}
                            color={"#fff"}
                            size={20}
                            style={styles.clearIcon}
                            onPress={() =>
                              setValue("weekdays.start", undefined)
                            }
                          />
                        ) : (
                          <IconButton
                            icon={props => (
                              <Icon name="add-circle" {...props} />
                            )}
                            color={"#fff"}
                            size={20}
                            style={styles.clearIcon}
                            onPress={() => setWDaysStartVisible(true)}
                          />
                        )
                      }
                    />
                  </>
                )}
                name="weekdays.start"
                rules={{ required: true }}
                defaultValue=""
              />
            </Block>
            <Block noflex style={{ width: "45%" }}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder=""
                    returnKeyType="next"
                    value={value}
                    onChangeText={value => onChange(value)}
                    error={hasError("weekdays")}
                    errorText={errors?.weekdays?.message}
                    autoCapitalize="none"
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    editable={false}
                    right={
                      value ? (
                        <IconButton
                          icon={props => (
                            <Icon name="highlight-remove" {...props} />
                          )}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setValue("weekdays.end", undefined)}
                        />
                      ) : (
                        <IconButton
                          icon={props => <Icon name="add-circle" {...props} />}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setWDaysEndVisible(true)}
                        />
                      )
                    }
                  />
                )}
                name="weekdays.end"
                rules={{ required: true }}
                defaultValue=""
              />
            </Block>
            <Block noflex middle>
              <Text>{timezone}</Text>
            </Block>
          </Block>
        </Block>

        <Block noflex paddingHorizontal={15} marginBottom={20}>
          <Block noflex marginBottom={10}>
            <Text color={theme.colors.text}>Availability on weekends:</Text>
          </Block>
          <Block flex row>
            <Block noflex style={{ width: "45%" }} marginRight={10}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder=""
                    returnKeyType="next"
                    value={value}
                    onChangeText={value => onChange(value)}
                    error={hasError("weekends")}
                    errorText={errors?.weekends?.message}
                    autoCapitalize="none"
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    editable={false}
                    right={
                      value ? (
                        <IconButton
                          icon={props => (
                            <Icon name="highlight-remove" {...props} />
                          )}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setValue("weekends.start", undefined)}
                        />
                      ) : (
                        <IconButton
                          icon={props => <Icon name="add-circle" {...props} />}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setWEndsStartVisible(true)}
                        />
                      )
                    }
                  />
                )}
                name="weekends.start"
                rules={{ required: true }}
                defaultValue=""
              />
            </Block>
            <Block noflex style={{ width: "45%" }}>
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    placeholder=""
                    returnKeyType="next"
                    value={value}
                    onChangeText={value => onChange(value)}
                    error={hasError("weekends")}
                    errorText={errors?.weekends?.message}
                    autoCapitalize="none"
                    inputStyle={styles.textInput}
                    placeholderTextColor="#adadad"
                    containerStyle={styles.textInputContainer}
                    editable={false}
                    right={
                      value ? (
                        <IconButton
                          icon={props => (
                            <Icon name="highlight-remove" {...props} />
                          )}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setValue("weekends.end", undefined)}
                        />
                      ) : (
                        <IconButton
                          icon={props => <Icon name="add-circle" {...props} />}
                          color={"#fff"}
                          size={20}
                          style={styles.clearIcon}
                          onPress={() => setWEndsEndVisible(true)}
                        />
                      )
                    }
                  />
                )}
                name="weekends.end"
                rules={{ required: true }}
                defaultValue=""
              />
            </Block>
            <Block noflex middle>
              <Text>{timezone}</Text>
            </Block>
          </Block>
        </Block>

        <Block
          noflex
          paddingHorizontal={15}
          marginBottom={20}
          style={{ zIndex: 3000 }}>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <Block noflex row center>
                  <Block noflex marginRight={10}>
                    {Platform.OS === "ios" ? (
                      <Switch
                        disabled={!isStarter}
                        value={!!value}
                        onValueChange={() => onChange(!value)}
                      />
                    ) : (
                      <Checkbox
                        disabled={!isStarter}
                        status={value ? "checked" : "unchecked"}
                        onPress={() => {
                          onChange(!value);
                        }}
                      />
                    )}
                  </Block>
                  <Block>
                    <Text>Ping me in Discord for scrims</Text>
                  </Block>
                </Block>
              );
            }}
            name="scrim"
            rules={{ required: true }}
            defaultValue=""
          />
        </Block>

        <Block marginHorizontal={10}>
          {renderTimePickers()}
          {renderActionSheet()}
          <Button
            mode="contained"
            onPress={handleSubmit(handleUpdateTeamDetails)}>
            Update Details
          </Button>
        </Block>
      </Block>
    </KeyboardAwareScrollView>
  );
};

export default MyTeamsDetails;

const styles = StyleSheet.create({
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
  error: {
    fontSize: 14,
    color: coreTheme.colors.error,
    paddingHorizontal: 0,
    paddingTop: 4,
  },
  clearIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
  },
});
