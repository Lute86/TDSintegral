class HttpResponse{
  //success 200
  static success(res, data){
    return res.status(200).json({
      status: 200,
      statusMsg: "Successful petition",
      data
    })
  }
  //created 201
  static created(res, data){
    return res.status(201).json({
      status: 201,
      statusMsg: "Created",
      data,
    })
  }
  //noContent 204
  static noContent(res, data){
    return res.status(204).json({
      status: 204,
      statusMsg: "No content",
      message: "Accion realizada con exito",
      data
    })
  }
  //badRequest 400
  static badRequest(res, data){
    return res.status(400).json({
      status: 400,
      statusMsg: "Bad request",
      data,
    })
  }
  //unauthorized 401
  static unauthorized(res, data){
    return res.status(401).json({
      status: 401,
      statusMsg: "Unauthorized",
      data,
    })
  }
  //forbidden 403
  static forbidden(res){
    return res.status(403).json({
      status: 403,
      statusMsg: "Forbidden",
      message: "Prohibido - no puedes acceder a este recurso",
    })
  }
  //notFound 404
  static notFound(res, data){
    return res.status(404).json({
      status: 404,
      statusMsg: "Not found",
      data,
    })
  }
  //conflict 409
  static conflict(res, data){
    return res.status(409).json({
      status: 409,
      statusMsg: "Conflict",
      data,
    })
  }
  //serverError 500
  static serverError(res, data){
    return res.status(500).json({
      status: 500,
      statusMsg: "Server error",
      message: "Error del servidor",
      data,
    })
  }
}


module.exports = HttpResponse