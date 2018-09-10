import * as React from 'react';


interface IProps {
    x0: number,
    x1: number,
    y0: number,
    y1: number
}

export class NestedComponent extends React.Component<IProps, {}> {

    public constructor(props: any){
        super(props);

    }
    
    public draw= (canvas: any) => {
        const x0=this.props.x0;
        const x1=this.props.x1;
        const y0=this.props.y0;
        const y1=this.props.y1;
        const ctx = canvas.getContext("2d");
        ctx.moveTo(x1, Math.floor((y1-y0)/4)+y0);
        ctx.bezierCurveTo(x0, y0, x0, Math.floor((y1-y0)/4), Math.floor((x1-x0)/2)+x0, Math.floor((y1-y0)/2))+y0;
        ctx.stroke();
    }
    
    public render() {
    return (
        <div>
            <canvas ref={(canvas) => this.draw(canvas)} width={500} height={500} />
        </div>
    )};
}
