export type SegmentPopupProps={
    onClose:() => void
    isVisible:boolean
}

export type SegmentDropdownListProps={
    id:number
    label:string
    value:string
}

export type CreateSegmentDataProps={
    segment_name:string
    segment_schema:SegmentDropdownListProps[]
}