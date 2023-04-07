import React, { CSSProperties } from 'react'
import { CircleLoader, SyncLoader

,ClimbingBoxLoader
 } from 'react-spinners';

const override: CSSProperties = {
    display: "block",
    margin: "5rem auto",
    borderColor: "red",
    width: 'fit-content'
};

export const SyncLoading = () => {
  return (
    <SyncLoader
    loading={true}
    color="#2B4137"
    cssOverride={override}
    size={8}
    aria-label="Loading Spinner"
    data-testid="loader"
  />
  )
}
