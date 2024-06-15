import Api from "../drupal/Api";
import { useAtom } from "jotai";
import { apiAtom } from "../storage/atoms";
import Connection from "../drupal/Connection";
import { useEffect } from "react";

const ApiProvider = (props) => {
    const [api, setApi] = useAtom(apiAtom);

    useEffect(() => {
      const drupal = new Connection();
      setApi(new Api(drupal, props.store));
    }, []);

    return (
        <>{props.children}</>
    );
};

export default ApiProvider;