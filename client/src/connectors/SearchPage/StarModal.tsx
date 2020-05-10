import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

interface Props {
  initialNotes?: string;
  onSave(value: string): void;
  onCancel(): void;
}

export default function StarModal({ initialNotes = "", ...props }: Props) {
  const [notes, setNotes] = useState(initialNotes);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  return ReactDOM.createPortal(
    <div className="fixed flex justify-center items-center inset-0 bg-gray-800 bg-opacity-50 z-10">
      <Grid className="w-120 bg-white p-8 rounded-lg grid gap-6">
        <TextArea
          className="rounded border resize-none p-3 h-40"
          value={notes}
          placeholder="Enter notes..."
          onChange={(event) => setNotes(event.target.value)}
        />

        <CancelButton
          className="flex justify-center items-center bg-transparent hover:bg-gray-200 text-gray-800 font-semibold py-2 border-gray-200 rounded"
          onClick={props.onCancel}
        >
          Cancel
        </CancelButton>

        <OkButton
          className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded"
          onClick={() => props.onSave(notes)}
        >
          Ok
        </OkButton>
      </Grid>
    </div>,
    document.getElementById("modalRoot")!
  );
}

const Grid = styled.div`
  grid-template: 1fr auto / auto ${(props) => props.theme.spacing[20]} ${(
      props
    ) => props.theme.spacing[20]};
`;

const TextArea = styled.textarea`
  grid-column: 1 / 4;
  grid-row: 1 / 2;
`;

const CancelButton = styled.button`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`;

const OkButton = styled.button`
  grid-column: 3 / 4;
  grid-row: 2 / 3;
`;
