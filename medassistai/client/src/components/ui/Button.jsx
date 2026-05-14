import React from 'react'

export default function Button({ children, ...props }){
  return (
    <button {...props} style={{padding:'8px 12px',borderRadius:6}}>{children}</button>
  )
}
