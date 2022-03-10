import React from "react";
import { StyleSheet, Image, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Card, DataTable, Divider } from "react-native-paper";
import { Block, EmptyBlockMessage, Text } from "../../../../components";
import { formatDate, openUrl, resolveImage } from "../../../../utils";
import * as fromModels from "../../models";
import { theme as coreTheme } from "../../../../core/theme";

type Props = {
  homeTeam: fromModels.BaseTeam;
  awayTeam: fromModels.BaseTeam;
  maps?: fromModels.Stadium[];
};

const CommonMaps = ({ maps = [], homeTeam, awayTeam }: Props) => {
  console.log(maps,"maps");
  
  const renderItem = (item: fromModels.Stadium) => {
    return (
      <Card style={{ marginBottom: 10 }}>
        <Card.Title
          title={item.map}
          subtitle={`Played ${item.played} match(es)`}
        />
        <Divider />
        <Card.Content
          style={{
            paddingHorizontal: 0,
          }}>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title style={[styles.title, { flex: 3 }]}>
                {homeTeam.name}
              </DataTable.Title>
              <DataTable.Title style={[styles.title, { flex: 3 }]}>
                {awayTeam.name}
              </DataTable.Title>
            </DataTable.Header>
            <DataTable.Header>
              <DataTable.Title style={styles.title}>Win</DataTable.Title>
              <DataTable.Title style={styles.title}>RSW</DataTable.Title>
              <DataTable.Title style={styles.title}>RSWP</DataTable.Title>
              <DataTable.Title style={styles.title}>Win</DataTable.Title>
              <DataTable.Title style={styles.title}>RSW</DataTable.Title>
              <DataTable.Title style={styles.title}>RSWP</DataTable.Title>
            </DataTable.Header>

            {maps.map((map, index) => (
              <DataTable.Row key={`common-map-${index}`}>
                <DataTable.Cell style={styles.cell}>
                  {map.team1Win}
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  {map.team1RoundsWin}
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  {map.team1RoundsWinPercentage}
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  {map.team2Win}
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  {map.team2RoundsWin}
                </DataTable.Cell>
                <DataTable.Cell style={styles.cell}>
                  {map.team2RoundsWinPercentage}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    );
  };

  if (maps.length > 0) {
    return (
      <Block marginBottom={10}>
        <Block noflex center middle paddingVertical={10}>
          <Text title primary marginBottom={5}>
            Maps Common History
          </Text>
          <Text small>RSW - Rounds Win, RSWP = Rounds Win Percentage</Text>
        </Block>
        <FlatList
          nestedScrollEnabled
          scrollEnabled={false}
          data={maps}
          keyExtractor={(item, index) => `common-match-${index}`}
          renderItem={({ item }) => renderItem(item)}
          ListEmptyComponent={
            <EmptyBlockMessage message="No common maps history are available." />
          }
        />
      </Block>
    );
  } else {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <EmptyBlockMessage message="No common maps history are available." />
        </Card.Content>
      </Card>
    );
  }
};
export default CommonMaps;

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
  },
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
