import React, {Component} from "react"
import DropdownAlert from "react-native-dropdownalert"

export class DropdownMessage extends Component {
  static dropDown
  static setDropDown(dropDown) {
    this.dropDown = dropDown
  }
  static getDropDown() {
    return this.dropDown
  }
  static alert(message, messageType) {
    DropdownMessage.dropDown.alertWithType(messageType, "", message)
  }

  render() {
    return (
      <DropdownAlert
        ref={ref => DropdownMessage.setDropDown(ref)}
        closeInterval={5000}
      />
    )
  }
}

export default DropdownMessage
