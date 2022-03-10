import React, { useState } from "react";
import { ScrollView, RefreshControl, StyleSheet } from "react-native";
import { Block, Text, TextInput } from "../../../../components";
import { Avatar, Divider, List, useTheme } from "react-native-paper";
import { theme as coreTheme, theme } from "../../../../core/theme";
import Icon from "react-native-vector-icons/Feather";
import { resolveImage } from "../../../../utils";

type Props = {
  refreshData?: () => void;
  handleSubstituteDetails: () => void;
  loading?: boolean;
};

const Substitutes = ({
  substitute,
  refreshData,
  handleSubstituteDetails,
  loading = false,
}: Props) => {
  const theme = useTheme();
  const ref = React.useRef<ScrollView>(null);
  const onRefresh = React.useCallback(() => {
    refreshData && refreshData();
  }, []);

  const SortedPlayers = substitute.sort((a, b) => {
    if (a.routes) return -1; // new check
    if (b.routes) return 1; // new check
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1;
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1;
    return 0;
  });
  const [searchtext, setSearchtext] = useState(substitute);
  const [search, setSearch] = useState(false);

  const handleSearch = e => {
    setSearch(true);
    setSearchtext(
      substitute.filter(i =>
        i.userName.toLowerCase().includes(e.toLowerCase()),
      ),
    );
  };

  return (
    <React.Fragment>
      <Block noflex>
        <TextInput
          placeholder="Search for a Substitute"
          returnKeyType="next"
          onChangeText={e => handleSearch(e)}
          autoCapitalize="none"
          placeholderTextColor="#adadad"
          inputStyle={styles.textInput}
          placeholderTextColor="#adadad"
          containerStyle={styles.textInputContainer}
        />
        <Icon name="search" color="#ffffff" size={25} style={styles.search} />
      </Block>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary, theme.colors.text]}
          />
        }>
        {search === true ? (
          searchtext.map(substitute => (
            <Block noflex key={`substitute-${substitute.playerID}`}>
              <List.Item
                title={substitute.userName}
                left={props => (
                  <Avatar.Image
                    source={{ uri: resolveImage(substitute.userLogo) }}
                    size={30}
                  />
                )}
                style={{
                  flex: 1,
                  paddingLeft: 0,
                  marginLeft: 0,
                }}
                onPress={() => handleSubstituteDetails(substitute)}
              />
              <Divider />
            </Block>
          ))
        ) : substitute ? (
          <List.Section>
            {substitute.map(substitute => (
              <Block noflex key={`substitute-${substitute.playerID}`}>
                <List.Item
                  title={substitute.userName}
                  left={props => (
                    <Avatar.Image
                      source={{ uri: resolveImage(substitute.userLogo) }}
                      size={30}
                    />
                  )}
                  style={{
                    flex: 1,
                    paddingLeft: 0,
                    marginLeft: 0,
                  }}
                  onPress={() => handleSubstituteDetails(substitute)}
                />
                <Divider />
              </Block>
            ))}

            <Divider />
          </List.Section>
        ) : null}
      </ScrollView>
    </React.Fragment>
  );
};

export default Substitutes;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: "#537791" },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  textInput: {
    zIndex: 100,
    backgroundColor: coreTheme.colors.background,
    paddingLeft: 10,
    // borderBottomColor: "transparent",
  },
  textInputContainer: {
    marginVertical: 0,
    marginBottom: 10,
  },
  search: {
    position: "absolute",
    right: 10,
    top: 10,
  },
});
