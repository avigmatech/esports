import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Image, View, Text } from "react-native";
import { Divider, HelperText, List } from "react-native-paper";
import { FAQContents } from "../../../core/constants";

const FAQs = ({ navigation }) => {
  const [firsthalf, setFirsthalf] = useState("");
  const [secondhalf, setSecondHalf] = useState("");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      faqfilter();
    });
    return unsubscribe;
  }, [navigation]);

  const faqfilter = () => {
    for (var i = 0; i < FAQContents.length; i++) {
      if (FAQContents[i].id === 5) {
        // console.log(FAQContents[i].content);
        var word = FAQContents[i].content;
        var len = word.length;
        var firstHalf = word.substring(0, len / 7.2);
        var secondHalf = word.substring(len / 7.2);
        setFirsthalf(firstHalf);
        setSecondHalf(secondHalf);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <List.AccordionGroup>
          {FAQContents.map(faq => (
            <React.Fragment>
              <List.Accordion
                key={`faq-item-${faq.id}`}
                title={faq.title}
                titleNumberOfLines={2}
                id={faq.id.toString()}>
                <HelperText type="info" visible={true}>
                  {/* {faq.id === 5 ? (
                    <View style={{ paddingHorizontal: 20 }}>
                      <Text style={{ color: "#ffffff", fontSize: 12 }}>
                        {firsthalf}
                      </Text>
                      <Image
                        style={{
                          height: 12,
                          width: 12,
                          position: "absolute",
                          left: 145,
                          top: 16,
                        }}
                        source={{
                          uri:
                            "https://vrmasterleague.com/images/challenge_20.png",
                        }}
                      />

                      <Text style={{ color: "#ffffff", fontSize: 12 }}>
                        {secondhalf}
                      </Text>
                    </View>
                  ) : ( */}
                  {faq.content}
                  {/* )} */}
                </HelperText>
              </List.Accordion>
              <Divider />
            </React.Fragment>
          ))}
        </List.AccordionGroup>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQs;
