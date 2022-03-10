import React from "react";
import { StyleSheet, Image, Dimensions } from "react-native";
import { DataTable, Divider, useTheme } from "react-native-paper";
import { Card, Avatar } from "react-native-paper";

import { Block, Text } from "../../../../components";
import { ordinalSuffixOf, resolveImage } from "../../../../utils";
import * as fromModels from "../../models";

type Props = {
  matchStats: fromModels.TeamsStats;
  homeTeam: fromModels.TeamDetPlayers;
  awayTeam: fromModels.TeamDetPlayers;
};

const { width } = Dimensions.get("window");
const playerContWidth = (width - (20 + 20)) / 2;

const CompareTeams = ({ matchStats, homeTeam, awayTeam }: Props) => {
  console.log(matchStats,"matchStatsmatchStats");
  
  return (
    <Card style={styles.card}>
      <Card.Title title="Team Details" />
      <Divider />
      <Card.Content style={{ marginTop: 10 }}>
        <Block noflex row marginBottom={10}>
          <Block row middle center marginRight={10}>
            <Block>
              <Text right>{homeTeam.name}</Text>
            </Block>
            <Block noflex marginLeft={10}>
              <Image
                source={{ uri: resolveImage(homeTeam.logo) }}
                style={{ width: 40, height: 40 }}
              />
            </Block>
          </Block>
          <Block row middle center marginLeft={10}>
            <Block noflex marginRight={10}>
              <Image
                source={{ uri: resolveImage(awayTeam.logo) }}
                style={{ width: 40, height: 40 }}
              />
            </Block>
            <Block>
              <Text>{awayTeam.name}</Text>
            </Block>
          </Block>
        </Block>
        <Block noflex row center marginBottom={10}>
          <Block flex marginRight={10}>
            <Text right>
              {`ranked ${ordinalSuffixOf(matchStats.team1Rank)}`}
            </Text>
          </Block>
          <Block marginLeft={10}>
            <Text>{`ranked ${ordinalSuffixOf(matchStats.team2Rank)}`}</Text>
          </Block>
        </Block>
        <Block row noflex>
          <Block
            style={{
              width: playerContWidth,
            }}>
            <DataTable>
              {homeTeam.players?.map(player => (
                <DataTable.Row key={`team1-player-${player.id}`}>
                  <DataTable.Cell style={{ justifyContent: "flex-end" }}>
                    <Block row middle center>
                      <Block wrap center middle marginRight={10}>
                        <Text subtitle style={{ textAlign: "right" }}>
                          {player.name}
                        </Text>
                      </Block>
                      <Avatar.Image
                        source={{ uri: resolveImage(player.logo) }}
                        size={30}
                      />
                    </Block>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Block>
          <Block style={{ width: playerContWidth }}>
            <DataTable>
              {awayTeam.players?.map(player => (
                <DataTable.Row key={`team2-player-${player.id}`}>
                  <DataTable.Cell style={{}}>
                    <Block row middle center>
                      <Avatar.Image
                        source={{ uri: resolveImage(player.logo) }}
                        size={30}
                      />
                      <Block wrap center middle marginLeft={10}>
                        <Text subtitle style={{ textAlign: "right" }}>
                          {player.name}
                        </Text>
                      </Block>
                    </Block>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Block>
        </Block>
      </Card.Content>
    </Card>
  );
};

export default CompareTeams;

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
});
