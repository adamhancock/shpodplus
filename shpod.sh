#!/bin/sh
# For more information about shpod, check it out on GitHub:
# https://github.com/jpetazzo/shpod

YAML=https://cdn.a9k.io/get/shpod.yaml
echo "namespace?"; read namespace
echo "Applying YAML: $YAML..."
kubectl apply -f $YAML -n $namespace
echo "Waiting for pod to be ready..."
kubectl wait --namespace=$namespace --for condition=Ready pod/shpod
echo "Attaching to the pod..."
kubectl -n namespace attach --namespace=shpod -ti shpod </dev/tty
echo "Deleting pod..."
echo "
Note: it's OK to press Ctrl-C if this takes too long and you're impatient.
Clean up will continue in the background. However, if you want to restart
shpod, you need to wait a bit (about 30 seconds).
"
kubectl delete -f $YAML --now -n $namespace
echo "Done."