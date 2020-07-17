import gql from 'graphql-tag';

export const GetQuery1 = gql`
query get_head($status: [String!],$type: String!) {
  tmpshop_tblheader(where: {status: {_in:$status}, type: {_eq:$type}}) {
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
  tmpshop_tblstock(where: {headid: {_eq: $headid}}, order_by: {catid: asc}) {
    index
    gcode
    gname
    catid
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
      time
      tblitems {
        cnt
        gds
        prc
        idx
        cid
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
mutation upd_stock($headid: Int!, $index: Int!, $stock: Int!) {
  update_tmpshop_tblstock(where: {index: {_eq: $index}, headid: {_eq: $headid}}, _set: {stock: $stock}) {
    affected_rows
  }
}`;
export const DeleteDetail = gql`
mutation del_detail($headid: Int!,$index: Int!,$usrid: String!) {
  delete_tmpshop_tbldetail(where: {headid: {_eq: $headid}, index: {_eq: $index}, usrid: {_eq: $usrid}}) {
    affected_rows
  }
}`;