import React from "react";
import { StyleSheet } from "react-native";
import { Appbar, useTheme, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { StackHeaderProps } from "@react-navigation/stack";
import { DrawerActions } from "@react-navigation/routers";
import { useNetInfo } from "@react-native-community/netinfo";
import Block from "./Block";
import Text from "./Text";

type Props = StackHeaderProps & {
  hideBackBtn?: boolean;
  hideDrawerToggle?: boolean;
};

const MenuInon = (props: any) => {
  return <Icon name="menu" {...props} />;
};

const Header = ({
  scene,
  previous,
  navigation,
  hideBackBtn,
  hideDrawerToggle,
}: Props) => {
  const theme = useTheme();
  const { isConnected } = useNetInfo();
  const { options } = scene.descriptor;
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : scene.route.name;

  const renderBackAction = () => {
     if (previous && !hideBackBtn) {
       return <Appbar.BackAction onPress={navigation.goBack} />;
     }
    if (hideDrawerToggle) {
      return;
    }
    return (
      <Appbar.Action
        icon={MenuInon}
        size={28}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
    );
  };

  return (
    <Appbar.Header
      style={{
        backgroundColor: theme.colors.background,
        borderBottomColor: "#fff",
        borderBottomWidth: 1,
      }}>
      {renderBackAction()}
      <Appbar.Content
        title={
          isConnected ? (
            title
          ) : (
            <Block row middle center>
              <ActivityIndicator size={15} />
              <Text subtitle white marginLeft={10}>
                waiting for network...
              </Text>
            </Block>
          )
        }
        // subtitle={headerSubTitle}
        titleStyle={styles.titleStyle}
      />
      {options.headerRight && options.headerRight({ tintColor: "red" })}
    </Appbar.Header>
  );
};

export default Header;

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    fontWeight: "800",
    // textTransform: "uppercase",
  },
});
