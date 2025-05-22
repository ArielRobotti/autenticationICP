import Principal "mo:base/Principal";
actor {
  public shared query  ({caller}) func quienSoy() : async Text {
    return Principal.toText(caller);
  };
};
