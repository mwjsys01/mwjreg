import gql from 'graphql-tag';

export const GetQuery1 = gql`
query get_head($status: String!,$type: String) {
  tmpshop_tblheader(where: {status: {_eq:$status}, type: {_eq:$type}}) {
    headid
    type
    name
    status
    created_at
    code
    usr
    denno
  }
}`;
export const UpdateStatus = gql`
mutation update_status($headid: Int!,$now: timestamptz!) {
  update_tmpshop_tblheader(where: {headid: {_eq: $headid}},
                   _set: {status: "EDIT", updated_at: $now}) {
    affected_rows
  }
}`;
export const GetQuery2 = gql`
query get_stock($headid: Int!) {
  tmpshop_tblstock(where: {headid: {_eq: $headid}}) {
    gcode
    gname
    categ
    stock
    price1
    price2
    price3
    price4
    price5
  }
}`;

export const GetQuery3 = gql`
query get_custom($scode: String!) {
  tmpshop_tblcustomer(where: {scode: {_eq: $scode}}) {
    mcode
    name
    tkbn
    zkbn
  }
}`;

export const GetQuery4 = gql`
query get_tankakbn {
  tmpshop_tbltankakbn {
    tkbn
    name
  }
}`;
export const GetQuery5 = gql`
query get_head($headid: Int!) {
  tmpshop_tblheader_by_pk(headid:$headid) {
    tbldetails {
      cus
      headid
      index
      neb
      payt
      rat
      sum
      tblitems {
        cnt
        gds
        prc
        idx
        ctg
      }
    }
  }
}`;

export const InsertDetail = gql`
mutation ins_detail($object: [tmpshop_tbldetail_insert_input!]!) {
  insert_tmpshop_tbldetail(objects: $object) {
    affected_rows
  }
}`;

export const UpdateStock = gql`
mutation upd_stock($headid: Int!, $gcode: String!, $stock: Int!) {
  update_tmpshop_tblstock(where: {gcode: {_eq: $gcode}, headid: {_eq: $headid}}, _set: {stock: $stock}) {
    affected_rows
  }
}`;