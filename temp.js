displayDOB:"pick a date",
    DOB:"",
    studentGender:"",
    isDateTimePickerVisibleDOB: false,
    studentAge:"",

    dateTimePickerHandler={
        _showDateTimePickerDOB: () => {this.setState({ isDateTimePickerVisibleDOB: true })},
        _hideDateTimePickerDOB: () => {this.setState({ isDateTimePickerVisibleDOB: false })},
        _handleDatePickedDOB: (date) => {
            let tempDate=this.returnValidDate(date);
            this.setState({
                DOB:tempDate.year.concat("-",tempDate.month,"-",tempDate.day),
                displayDOB:tempDate.day.concat("-",tempDate.monthName,"-",tempDate.year)
            });
            this.dateTimePickerHandler._hideDateTimePickerDOB();
        },






<View style={{flexDirection:"row",alignItems:"center",marginTop:5,marginBottom:5}}>
    <Text style={{flex:2,marginTop:"7%"}}>Gender:</Text>
    <View style={{flex:4,marginTop:"-3%",height:"80%"}}>
        <Dropdown
            label='  Select gender'
            data={[{value: 'male'},{value: 'female'}]}
            fontSize={16}
            baseColor="rgba(0,0,0,1)"
            textColor="rgba(0,0,0,1)"
            itemColor="rgba(255, 255, 255,1)"
            selectedItemColor="rgba(0, 0, 0,1)"
            pickerStyle={{backgroundColor:"rgba(121, 121, 121,0.80)"}}
            value={this.state.gender}
            onChangeText={
                (studentGender)=>{this.setState({studentGender:studentGender})}}
        />
    </View>
</View>

<View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
<Text style={{flex:1}}>Age:</Text>
<View style={{flex:2,borderWidth:0.5,borderRadius:5,height:40}}>
    <TextInput
        style={{padding:10}}
        placeholder="enter student's age"
        autoCorrect={false}
        onChangeText={(studentAge)=>{this.setState({studentAge:studentAge})}}
    />
    </View>
</View>


<View style={{flexDirection: "row", alignItems: "center", justifyContent: "center",marginTop:"5%"}}>
    <Text style={{flex:1}}>Date of birth:</Text>
    <View style={{ flex: 2 }}>
    <TouchableOpacity
    style={{flex:1,borderBottomWidth:0.5,height:40,flexDirection:"row",alignItems:"center"}}
    onPress={this.dateTimePickerHandler._showDateTimePickerDOB}>
    <Text style={{flex:7,fontSize:16,paddingLeft:"5%"}}>{this.state.displayDOB}</Text>
<MaterialIcons
    name="arrow-drop-down"
    size={27}
    style={{flex:1,color: "#000000"}}
/>
</TouchableOpacity>
<DateTimePicker
    isVisible={this.state.isDateTimePickerVisibleDOB}
    onConfirm={this.dateTimePickerHandler._handleDatePickedDOB}
    onCancel={this.dateTimePickerHandler._hideDateTimePickerDOB}
/>
</View>
</View>