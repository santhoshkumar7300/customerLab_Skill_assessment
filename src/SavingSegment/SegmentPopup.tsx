import React, { useState } from "react";
import classes from "./style.module.css";
import { Dropdown, Modal } from "react-bootstrap";
import {
  CreateSegmentDataProps,
  SegmentDropdownListProps,
  SegmentPopupProps,
} from "../@types/general";
import * as Yup from "yup";
import { useFormik } from "formik";
import DownArrowIcon from "../Assets/Svg/down_arrow.svg";

const segmentSchema = Yup.object().shape({
  segment_name: Yup.string().required("Segment name is required"),
  segment_schema: Yup.mixed()
    .transform((val) => (val?.length > 0 ? val : undefined))
    .required("Please select atleast one segment."),
});

export default function SegmentPopup({
  isVisible = false,
  onClose,
}: SegmentPopupProps) {
  const [tempSelectedSegment, settempSelectedSegment] = useState<
    SegmentDropdownListProps | null | undefined
  >(null);
  const [segmentDropdownList, setsegmentDropdownList] = useState<
    SegmentDropdownListProps[]
  >([
    {
      id: 1,
      label: "First Name",
      value: "first_name",
    },
    {
      id: 2,
      label: "Last Name",
      value: "last_name",
    },
    {
      id: 3,
      label: "Gender",
      value: "gender",
    },
    {
      id: 4,
      label: "Age",
      value: "age",
    },
    {
      id: 5,
      label: "Account Name",
      value: "account_name",
    },
    {
      id: 6,
      label: "City",
      value: "city",
    },
    {
      id: 7,
      label: "State",
      value: "state",
    },
  ]);
  const { handleChange, handleSubmit, errors, touched, setFieldValue, values } =
    useFormik({
      initialValues: {
        segment_name: "",
        segment_schema: [],
      },
      validationSchema: segmentSchema,
      onSubmit: (values) => {
        handleCreateSegment(values);
      },
    });

  const handleCreateSegment = (data: CreateSegmentDataProps) => {
      
      const requestData:any = {
          segment_name: data.segment_name,
      schema: data.segment_schema.map((ele) => {
        return { [ele.value]: ele.label };
      }),
    };
    
    console.log(JSON.stringify(requestData), "DATAAAAA");
    try {
        
      fetch("https://webhook.site/1c811c1a-7f02-4a66-addb-7611b68dc658", {
        method: "POST",
        body: JSON.stringify(requestData),
      })
        .then((res) => res.json())
        .then((response) => {
          console.log(response.data, "RESPONSEEEEEE");
        });
    } catch (error) {
      console.log(error, "API ERROR");
    }
  };

  console.log(errors);

  return (
    <Modal show={isVisible} onHide={onClose} size="lg">
      <Modal.Body>
        <p>Enter the name of the segment</p>
        <input
          className={classes.segmentInput}
          value={values.segment_name}
          onChange={handleChange("segment_name")}
          placeholder="Name of the segment"
        />
        {errors.segment_name && touched.segment_name && (
          <p className={classes.errTxt}>{errors.segment_name}</p>
        )}
        <p className="fs-5 mt-3">
          To save your segment, you need to add the schemas to build the query.
        </p>
        <div className={classes.indicationConatiner}>
          <p className={classes.positiveIndicator}> - User Traits</p>
          <p className={classes.negativeIndicator}> - Group Traits</p>
        </div>
        {[...values.segment_schema].length > 0 && (
          <div className={classes.selectedListContainer}>
            {[...values.segment_schema].map(
              (ele: SegmentDropdownListProps, ind: number) => {
                return (
                  <div className={classes.selectedItemContainer}>
                    <span
                      className={classes.selectedListIndication}
                      style={{
                        backgroundColor: (ind + 1) % 2 === 0 ? "red" : "green",
                      }}
                    ></span>
                    <div className={classes.selectedInputBoxContainer}>
                      <p>{ele.label}</p>
                      <img
                        src={DownArrowIcon}
                        alt="down_arrow"
                        width={25}
                        height={25}
                      />
                    </div>
                    <div
                      onClick={() => {
                        let tempDropdownList = [...segmentDropdownList];
                        tempDropdownList.splice(ele.id - 1, 0, ele);
                        setsegmentDropdownList([...tempDropdownList]);
                        let tempData = [...values.segment_schema];
                        tempData = tempData.filter(
                          (removeEle) => removeEle !== ele
                        );
                        setFieldValue("segment_schema", tempData);
                      }}
                      className={classes.removeItemContainer}
                    >
                      -
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
        <div className={classes.selectedItemContainer + " px-3"}>
          <span
            className={classes.selectedListIndication}
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          ></span>
          <Dropdown
            className="border"
            onSelect={(e) => {
              let refData: any = [...segmentDropdownList];
              refData = refData.find(
                (ele: SegmentDropdownListProps) => ele.value === e
              );
              if (refData !== undefined) {
                settempSelectedSegment(refData);
              }
            }}
          >
            <Dropdown.Toggle
              className="w-100"
              variant="white"
              id="dropdown-basic"
            >
              {tempSelectedSegment?.label || "Add schema to segment"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {segmentDropdownList.map((ele) => {
                return (
                  <Dropdown.Item key={ele.id.toString()} eventKey={ele.value}>
                    {ele.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
          <div
            onClick={() => {
              if (tempSelectedSegment) {
                settempSelectedSegment(null);
              }
            }}
            className={classes.removeItemContainer}
          >
            -
          </div>
        </div>
        {errors.segment_schema && touched.segment_schema && (
          <p className={classes.errTxt}>{errors.segment_schema}</p>
        )}
        <p
          style={{ color: tempSelectedSegment ? "green" : "rgba(0,0,0,0.5)" }}
          onClick={() => {
            if (tempSelectedSegment) {
              setFieldValue("segment_schema", [
                ...values.segment_schema,
                tempSelectedSegment,
              ]);
              let refData = [...segmentDropdownList];
              refData = refData.filter((ele) => ele !== tempSelectedSegment);
              setsegmentDropdownList([...refData]);
              settempSelectedSegment(null);
            }
          }}
          className={classes.addNewSchemaTxt}
        >
          + Add new schema
        </p>
      </Modal.Body>
      <Modal.Footer>
        <button className={classes.submitBtnTxt} onClick={() => handleSubmit()}>
          Save the segment
        </button>
        <button onClick={onClose} className={classes.cancelBtn}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}
