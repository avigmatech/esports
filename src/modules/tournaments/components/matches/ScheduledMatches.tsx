import React from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import MCIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { DataTable, Divider, TouchableRipple } from "react-native-paper";
import { Block, EmptyBlockMessage, Text } from "../../../../components";
import { formatDate, openUrl, resolveImage } from "../../../../utils";
import * as fromModels from "../../models";

type Props = {
  matches: fromModels.Match[];
  voteTeam: (match: fromModels.Match) => void;
  voteCast: (match: fromModels.Match) => void;
};

const ScheduledMatches = ({ matches, voteTeam, voteCast }: Props) => {

  const renderItem = (item: fromModels.Match) => {
    return (
      <Block
        noflex
        padding={10}
        marginBottom={10}
        style={{
          borderWidth: 1,
          borderColor: "#cacaca",
        }}>
        <Block flex row>
          <Block center>
            <Image
              source={{ uri: resolveImage(item.homeTeam.logo) }}
              style={styles.image}
            />
            <Text primary subtitle center>
              {item.awayTeam.name}
            </Text>
            <Block row center>
              <Icon
                name={
                  item.currentUserVotedTeamID &&
                  item.currentUserVotedTeamID === item.homeTeam.id
                    ? "star"
                    : "star-outline"
                }
                onPress={() => voteTeam(item)}
              />
              <Text subtitle>{item.homeBetCount}</Text>
            </Block>
          </Block>
          <Block noflex marginHorizontal={25} center middle>
            <Block noflex center>
              <Text subtitle bold>
                {formatDate(item.dateScheduled, "DD MMM, YYYY")}
              </Text>
              <Text subtitle>at</Text>
              <Text subtitle bold>
                {formatDate(item.dateScheduled, "hh:mm A")}
              </Text>
            </Block>
          </Block>
          <Block center>
            <Image
              source={{ uri: resolveImage(item.awayTeam.logo) }}
              style={styles.image}
            />
            <Text primary subtitle center>
              {item.awayTeam.name}
            </Text>
            <Block row center>
              <MCIcon
                name={
                  item.currentUserVotedTeamID &&
                  item.currentUserVotedTeamID === item.awayTeam.id
                    ? "star"
                    : "star-outline"
                }
                onPress={() => voteTeam(item)}
              />
              <Text subtitle>{item.awayBetCount}</Text>
            </Block>
          </Block>
        </Block>
        <Block>
          <Block center marginVertical={5}>
            <Text subtitle>Casters</Text>
          </Block>
          <Block row>
            <Block>
              <Text subtitle>{item.castingInfo.caster}</Text>
            </Block>
            <Block center>
              <TouchableRipple onPress={() => voteCast(item)}>
                <Image
                  source={require("../../../../assets/icons/upvote_off_17.png")}
                />
              </TouchableRipple>
              <Text subtitle gray>
                {item.castUpvotes}
              </Text>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  };

  return (
    <FlatList
      nestedScrollEnabled
      data={matches}
      keyExtractor={item => `past-match-${item.id}`}
      renderItem={({ item }) => renderItem(item)}
      ListEmptyComponent={
        <EmptyBlockMessage message="No scheduled matches are available." />
      }
    />
  );
};

export default ScheduledMatches;

const styles = StyleSheet.create({
  cell: {
    justifyContent: "center",
  },
  title: {
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "#cacaca",
    borderRadius: 5,
  },
});

{
  /* <DataTable>
            <DataTable.Header>
              <DataTable.Title style={styles.title}>
                Date Played
              </DataTable.Title>
              <DataTable.Title style={styles.title}>VOD</DataTable.Title>
              <DataTable.Title style={styles.title}>Home</DataTable.Title>
              <DataTable.Title style={styles.title}>Score</DataTable.Title>
              <DataTable.Title style={styles.title}>Away</DataTable.Title>
            </DataTable.Header>
            {matches.length > 0 ? (
              matches.map(match => (
                <DataTable.Row key={`history-match-${match.id}`}>
                  <DataTable.Cell style={styles.cell}>
                    {match.dateScheduled}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    {match.vodURL && (
                      <Icon
                        name="eye"
                        size={15}
                        onPress={() => openUrl(match.vodURL!)}
                      />
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    {match.homeTeam.name}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    {match.homeScore}-{match.awayScore}
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    {match.awayTeam.name}
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <Block marginTop={10} noflex>
                <EmptyBlockMessage message="No upcoming matches are available." />
              </Block>
            )}
          </DataTable> */
}
