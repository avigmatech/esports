import React from "react";
import { FlatList, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Card, DataTable, Divider, TouchableRipple } from "react-native-paper";
import { Block, EmptyBlockMessage, Text } from "../../../../components";
import { formatDate, openUrl, resolveImage } from "../../../../utils";
import * as fromModels from "../../models";

type Props = {
  matches: fromModels.MatchHistory[];
  goToMatchDetails?: (match: fromModels.BaseMatch) => void;
  goToTeamDetails?: (team: fromModels.BaseTeam) => void;
};

const TeamMatchHistory = ({
  matches,
  goToMatchDetails,
  goToTeamDetails,
}: Props) => {
  const renderItem = (item: fromModels.MatchHistory) => {
    // console.log(item,"itemmmmm");
    
    return (
      <Card
        style={{ marginBottom: 10 }}
        onPress={() => goToMatchDetails && goToMatchDetails(item)}>
        <Card.Content>
          <Block flex row>
            <Block center>
              <TouchableRipple
                onPress={() =>
                  goToTeamDetails && goToTeamDetails(item.homeTeam)
                }>
                <Image
                  source={{ uri: resolveImage(item.homeTeam.logo) }}
                  style={styles.image}
                />
              </TouchableRipple>
              <Text primary subtitle center>
                {item.homeTeam.name}
              </Text>
            </Block>
            <Block noflex marginHorizontal={25} center middle>
              <Block row noflex center marginBottom={10}>
                {item.homeTeam.id === item.winningTeamID ? (
                  <Icon name="arrow-up" color={"green"} size={20} />
                ) : (
                  <Icon name="arrow-down" color={"red"} size={20} />
                )}
                <Block row noflex>
                  <Text>{item.homeScore}</Text>
                  <Text>{" - "}</Text>
                  <Text>{item.awayScore}</Text>
                </Block>
                {item.awayTeam.id === item.winningTeamID ? (
                  <Icon name="arrow-up" color={"green"} size={20} />
                ) : (
                  <Icon name="arrow-down" color={"red"} size={20} />
                )}
              </Block>
              <Block noflex center>
                <Text subtitle bold>
                  {formatDate(item.dateScheduled, "DD MMM, YYYY")}
                </Text>
                <Text subtitle>at</Text>
                <Text subtitle bold>
                  {formatDate(item.dateScheduled, "hh:mm A")}
                </Text>
              </Block>
              {item.vodURL && (
                <Block center marginTop={10}>
                  <Icon
                    name="eye"
                    size={15}
                    color="#fafafa"
                    onPress={() => openUrl(item.vodURL!)}
                  />
                </Block>
              )}
            </Block>
            <Block center>
              <TouchableRipple
                onPress={() =>
                  goToTeamDetails && goToTeamDetails(item.awayTeam)
                }>
                <Image
                  source={{ uri: resolveImage(item.awayTeam.logo) }}
                  style={styles.image}
                />
              </TouchableRipple>
              <Text primary subtitle center>
                {item.awayTeam.name}
              </Text>
            </Block>
          </Block>
        </Card.Content>
      </Card>
    );
  };

  return (
    <FlatList
      nestedScrollEnabled
      data={matches}
      keyExtractor={item => `past-match-${item.id}`}
      renderItem={({ item }) => renderItem(item)}
      ListEmptyComponent={
        <EmptyBlockMessage message="No past matches are available." />
      }
    />
  );
};

export default TeamMatchHistory;

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
