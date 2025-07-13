import '../appIcon/appIcon.css'


const AppIcon = (props) => {
  return (
    <>
    <div className="icon">
      <div className="iconImage">
        <img src={props.iconImage} alt="" />
      </div>
      <div className="iconName">{props.iconName}</div>

    </div>
    
    </>
  )
}

export default AppIcon
