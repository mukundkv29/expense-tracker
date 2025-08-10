import { useState, useRef, useEffect } from "react";
import { Modal, Text, View, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { styles } from "../styles/CalendarModalStyles";
import { monthNames, years } from "../utils/months";

export default function CalendarModal({
  visibility, 
  month, 
  year, 
  onMonthYearSelect, 
  onClose
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(month || new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(year || new Date().getFullYear());
  
  const monthScrollRef = useRef(null);
  const yearScrollRef = useRef(null);
  
  const ITEM_HEIGHT = 40;

  useEffect(() => {
    setModalVisible(visibility);
    if (visibility) {
      setSelectedMonth(month || new Date().getMonth());
      setSelectedYear(year || new Date().getFullYear());
    }
  }, [visibility, month, year]);

  useEffect(() => {
    if (modalVisible) {
      setTimeout(() => {
        monthScrollRef.current?.scrollTo({
          y: selectedMonth * ITEM_HEIGHT,
          animated: true,
        });
        
        const yearIndex = years.indexOf(selectedYear);
        if (yearIndex !== -1) {
          yearScrollRef.current?.scrollTo({
            y: yearIndex * ITEM_HEIGHT,
            animated: true,
          });
        }
      }, 100);
    }
  }, [modalVisible, selectedMonth, selectedYear]);

  const handleMonthScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, monthNames.length - 1));
    setSelectedMonth(clampedIndex);
  };

  const handleYearScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
    setSelectedYear(years[clampedIndex]);
  };

  const handleContinue = () => {
    console.log(`Selected: ${monthNames[selectedMonth]} ${selectedYear}`);
    
    if (onMonthYearSelect) {
      onMonthYearSelect(selectedMonth, selectedYear);
    }
    
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleCancel}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Selection indicator - Blue strip */}
          <View style={styles.selectionStrip} />
          
          <View style={styles.scrollContainer}>
            {/* Month ScrollView */}
            <View style={styles.columnContainer}>
              <LinearGradient
                colors={['white', 'transparent']}
                style={styles.topFade}
                pointerEvents='none'
              />
              <ScrollView 
                ref={monthScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleMonthScroll}
                onScrollEndDrag={handleMonthScroll}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              >
                {monthNames.map((monthName, index) => (
                  <View 
                    key={monthName}
                    style={styles.itemContainer}
                  >
                    <Text style={[
                      styles.itemText,
                      selectedMonth === index && styles.selectedText
                    ]}>
                      {monthName}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', 'white']}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </View>

            {/* Year ScrollView */}
            <View style={styles.columnContainer}>
              <LinearGradient
                colors={['white', 'transparent']}
                style={styles.topFade}
                pointerEvents='none'
              />
              <ScrollView 
                ref={yearScrollRef}
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                onMomentumScrollEnd={handleYearScroll}
                onScrollEndDrag={handleYearScroll}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
              >
                {years.map((year) => (
                  <View 
                    key={year}
                    style={styles.itemContainer}
                  >
                    <Text style={[
                      styles.itemText,
                      selectedYear === year && styles.selectedText
                    ]}>
                      {year}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <LinearGradient
                colors={['transparent', 'white']}
                style={styles.bottomFade}
                pointerEvents="none"
              />
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={handleCancel}>
              <Text style={styles.buttonText}>CANCEL</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonContinue]}
              onPress={handleContinue}>
              <Text style={styles.buttonText}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
