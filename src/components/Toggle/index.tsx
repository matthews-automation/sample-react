import "./index.scss";

export default function Toggle (props: ToggleProps){
    
    const { metric, onClick} = props

    return (
        <div onClick={onClick} className={`outer d-flex relative`}>
            <div style={{ left: metric ? '27px' : '3px', transition: 'left 0.3s ease', }} className="slider absolute"></div>
        </div>
        
    )
}